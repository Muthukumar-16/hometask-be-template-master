const Router = require("express-promise-router");

const { getContractsById, getContracts } = require("./contractsController");
const { getProfile } = require("../../middleware/getProfile");

const router = Router();

router.get("/:id", getProfile, getContractsById);
router.get("/", getProfile, getContracts);

module.exports = router;
