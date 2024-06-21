const Router = require("express-promise-router");
const { unpaidJobs, payForJob } = require("./jobsController");

const { getProfile } = require("../../middleware/getProfile");

const router = Router();

router.get("/unpaid", getProfile, unpaidJobs);
router.post("/:job_id/pay", getProfile, payForJob);

module.exports = router;
