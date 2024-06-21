const Router = require("express-promise-router");

const { deposit } = require("./balancesController");

const router = Router();

router.post("/deposit/:userId", deposit);

module.exports = router;
