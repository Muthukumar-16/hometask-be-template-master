const express = require("express");
const bodyParser = require("body-parser");
const { Op, col, fn } = require("sequelize");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

/**
 * @returns contract by id
 */
app.get("/contracts/:id", getProfile, async (req, res) => {
    try {
        const profileId = req.profile?.id || "";
        const { Contract } = req.app.get("models");
        const { id } = req.params;
        const contract = await Contract.findOne({ where: { id } });
        if (!contract) return res.status(404).end();
        const isClient = contract.ClientId === profileId;
        const isContractor = contract.ContractorId === profileId;

        if (!isClient && !isContractor) {
            return res.status(403).json({ error: "You do not have access to this contract" });
        }
        res.json(contract);
    } catch (error) {
        throw error;
    }
});

/**
 * @returns contracts of the logged in user
 */
app.get("/contracts", getProfile, async (req, res) => {
    try {
        const profileId = req.profile?.id || "";
        const { Contract } = req.app.get("models");
        const contracts = await Contract.findAll({ where: { ContractorId: profileId, status: { [Op.ne]: "terminated" } } });
        res.json(contracts);
    } catch (error) {
        throw error;
    }
});

/**
 * @returns contracts of the logged in user which are yet to be paid
 */
app.get("/jobs/unpaid", getProfile, async (req, res) => {
    try {
        const profileId = req.profile?.id;
        const { Contract, Job } = req.app.get("models");

        const contracts = await Job.findAll({
            where: { paid: { [Op.eq]: null } },
            include: {
                model: Contract,
                where: {
                    [Op.and]: [
                        { status: { [Op.ne]: "terminated" } },
                        { [Op.or]: [
                            { ClientId: profileId },
                            { ContractorId: profileId }
                        ] 
                    }],
                },
            },
        });

        res.json(contracts);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

/**
 * @returns 
 */
app.post("/jobs/:job_id/pay", async (req, res) => {
    const { job_id } = req.params;
    const profileId = req.profile?.id;

    const transaction = await sequelize.transaction();

    try {
        const job = await Job.findOne({
            where: { id: job_id, paid: { [Op.eq]: null } },
            include: {
                model: Contract,
                where: {
                    status: "in_progress",
                },
                include: [
                    { model: Profile, as: "Client" },
                    { model: Profile, as: "Contractor" },
                ],
            },
        });

        if (!job) {
            return res.status(404).json({ error: "Job not found or already paid" });
        }

        const client = job?.Contract?.Client;
        if (client.id !== profileId) {
            return res.status(403).json({ error: "Only the client can pay for this job" });
        }

        if (client.balance < job.price) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        client.balance -= job.price || 0;
        const contractor = job.Contract?.Contractor;
        contractor.balance += job.price || 0;

        job.paid = 1;
        job.paymentDate = new Date();

        await client.save({ transaction });
        await contractor.save({ transaction });
        await job.save({ transaction });

        await transaction.commit();

        res.json({ message: "Job paid successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/balances/deposit/:userId", async (req, res) => {
    try {
        const { Profile, Job } = req.app.get("models");
        const { amount } = req.body

        const transaction = await sequelize.transaction();
        const client = await Profile.findOne({ id: req.params?.userId});

        if(!client){
            return res.status(404).json({ error: "Client not found" });
        }

        const unpaidJobs = await Job.findAll({
            where: { paid: { [Op.eq]: null } },
            include: {
                model: Contract,
                where: { ClientId: userId, status : "in_progress" },
            },
        });

        const totalUnpaidJobsAmount = unpaidJobs.reduce((total,job)=>
            total+parseFloat(job.price),
            0
        )
        const maxDepositAmount = totalUnpaidJobsAmount * 0.25;

        if (amount > maxDepositAmount) {
            return res.status(400).json({ error: `Deposit amount exceeds the maximum allowed. You can only deposit up to ${maxDepositAmount.toFixed(2)}` });
        }
        
        client.balance += amount;
        await client.save({ transaction });
      
        await transaction.commit();
      
        res.json({ message: 'Deposit successful', newBalance: client.balance.toFixed(2) });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get("/admin/best-profession", async(req,res) => {
    try {
        const {start, end} = req.query;
        const { Profile, Contract, Job } = req.app.get("models");
        console.log(req.query);
        if (!start || !end) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
    
        const bestPaidJobs = await Job.findAll({
            attributes : [
                [col('Contract.Contractor.profession'),'profession'],
                [fn('SUM',col('price')), 'totalEarned']
            ],
            where: {
                paymentDate: {
                    [Op.between]: [new Date(start), new Date(end)]
                },
                paid : 1
            },
            include: [
                {
                    model: Contract,
                    include: [
                        {
                            model: Profile,
                            as: "Contractor",
                            attributes: ['profession']
                        },
                    ],
                    attributes: []
                } ],
            group: 'profession',
            order: [
                [fn('SUM',col('price')), 'DESC']
            ],
            raw: true,
            limit :1,
        })
    
        const bestPaidProfession = bestPaidJobs[0].profession;
        const totalEarned = bestPaidJobs[0].totalEarned;
        return res.status(200).json({
            bestPaidProfession,
            totalEarned,
        })
    } catch (error) {
        throw error;
    }
});


app.get('/admin/best-clients', async (req, res) => {
    const { start, end, limit = 2 } = req.query;
  
    if (!start || !end) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
  
    try {
      const bestClients = await Job.findAll({
        attributes: [
          [col('Contract.Client.id'), 'clientId'],
          [fn('CONCAT', col('Contract.Client.firstName'), ' ', col('Contract.Client.lastName')), 'clientName'],
          [fn('SUM', col('price')), 'paid']
        ],
        where: {
          paymentDate: {
            [Op.between]: [new Date(start), new Date(end)]
          },
          paid: 1
        },
        include: [
          {
            model: Contract,
            include: [
              {
                model: Profile,
                as: 'Client',
                attributes: []
              }
            ]
          }
        ],
        group: ['Contract.Client.id'],
        order: [[fn('SUM', col('price')), 'DESC']],
        limit: parseInt(limit, 10),
        raw: true
      });
  
      res.status(200).json(bestClients);
    } catch (error) {
      console.error('Error fetching best clients:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

module.exports = app;
