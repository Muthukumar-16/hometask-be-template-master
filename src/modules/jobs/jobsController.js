const  { Op } = require("sequelize");

const { sequelize } = require("../../model")

const unpaidJobs =  async (req, res) => {
  try {
      const profileId = req.profile?.id;
      const { Contract, Job } = req.app.get("models");

      const unpaidJobsList = await Job.findAll({
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

      res.json(unpaidJobsList);
  } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
  }
};

const payForJob =  async (req, res) => {
  const { job_id } = req.params || '';
  const profileId = req.profile?.id;
  const { Contract, Job, Profile } = req.app.get("models");
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
};

module.exports = {
  unpaidJobs,
  payForJob,
}