const Router = require("express-promise-router");

const { fetchBestProfession, fetchBestClients } = require("./adminController");

const router = Router();

router.get("/best-profession", fetchBestProfession);
router.get("/best-clients", fetchBestClients);

module.exports = router;
