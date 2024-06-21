const { Op } = require("sequelize");

const { sequelize } = require("../../model");

const deposit = async (req, res) => {
    try {
        const { Profile, Job, Contract } = req.app.get("models");
        const { amount } = req.body;
        const { userId } = req.params;

        const transaction = await sequelize.transaction();
        const client = await Profile.findOne({ id: userId });

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        const unpaidJobs = await Job.findAll({
            where: { paid: { [Op.eq]: null } },
            include: {
                model: Contract,
                where: { ClientId: userId, status: "in_progress" },
            },
        });

        const totalUnpaidJobsAmount = unpaidJobs.reduce((total, job) => total + parseFloat(job.price), 0);
        const maxDepositAmount = totalUnpaidJobsAmount * 0.25;

        if (amount > maxDepositAmount) {
            return res.status(400).json({ error: `Deposit amount exceeds the maximum allowed. You can only deposit up to ${maxDepositAmount.toFixed(2)}` });
        }

        client.balance += amount;
        await client.save({ transaction });

        await transaction.commit();

        res.status(200).json({ message: "Deposit successful", newBalance: client.balance.toFixed(2) });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = {
    deposit,
};
