const { Op } = require('sequelize')

const getContractsById = async (req, res) => {
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
};

const getContracts = async (req, res) => {
  try {
      const profileId = req.profile?.id || "";
      const { Contract } = req.app.get("models");
      const contracts = await Contract.findAll({ where: { ContractorId: profileId, status: { [Op.ne]: "terminated" } } });
      res.json(contracts);
  } catch (error) {
      throw error;
  }
};

module.exports = {
  getContractsById,
  getContracts,
}