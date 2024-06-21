const { Op, col, fn } = require("sequelize");

const fetchBestProfession = async (req, res) => {
    try {
        const { start, end } = req.query;
        const { Profile, Contract, Job } = req.app.get("models");
        if (!start || !end) {
            return res.status(400).json({ error: "Start date and end date are required" });
        }

        const bestPaidJobs = await Job.findAll({
            attributes: [
                [col("Contract.Contractor.profession"), "profession"],
                [fn("SUM", col("price")), "totalEarned"],
            ],
            where: {
                paymentDate: {
                    [Op.between]: [new Date(start), new Date(end)],
                },
                paid: 1,
            },
            include: [
                {
                    model: Contract,
                    include: [
                        {
                            model: Profile,
                            as: "Contractor",
                            attributes: ["profession"],
                        },
                    ],
                    attributes: [],
                },
            ],
            group: "profession",
            order: [[fn("SUM", col("price")), "DESC"]],
            raw: true,
            limit: 1,
        });

        const bestPaidProfession = bestPaidJobs[0]?.profession;
        const totalEarned = bestPaidJobs[0]?.totalEarned;
        return res.status(200).json({
            bestPaidProfession,
            totalEarned,
        });
    } catch (error) {
        throw error;
    }
};

const fetchBestClients = async (req, res) => {
    const { start, end, limit = 2 } = req.query;
    const { Profile, Contract, Job } = req.app.get("models");

    if (!start || !end) {
        return res.status(400).json({ error: "Start date and end date are required" });
    }

    try {
        const bestClients = await Job.findAll({
            attributes: [
                [col("Contract.Client.id"), "clientId"],
                [fn("CONCAT", col("Contract.Client.firstName"), " ", col("Contract.Client.lastName")), "clientName"],
                [fn("SUM", col("price")), "paid"],
            ],
            where: {
                paymentDate: {
                    [Op.between]: [new Date(start), new Date(end)],
                },
                paid: 1,
            },
            include: [
                {
                    model: Contract,
                    include: [
                        {
                            model: Profile,
                            as: "Client",
                            attributes: [],
                        },
                    ],
                },
            ],
            group: ["Contract.Client.id"],
            order: [[fn("SUM", col("price")), "DESC"]],
            limit: parseInt(limit, 10),
            raw: true,
        });
        
        res.status(200).json(bestClients);
    } catch (error) {
        console.error("Error fetching best clients:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = {
    fetchBestProfession,
    fetchBestClients,
};
