const router = require('express').Router();

const adminRouter = require("./modules/admin/adminRoutes");
const balancesRouter = require("./modules/balances/balancesRoutes");
const contractsRouter = require("./modules/contracts/contractsRoutes");
const jobsRouter = require("./modules/jobs/jobsRoutes");

router.use('/admin', adminRouter)
router.use('/balances', balancesRouter)
router.use('/contracts', contractsRouter)
router.use('/jobs', jobsRouter)

module.exports = router;