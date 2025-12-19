const express = require("express");
const userRoute = require("./users/index");
const adminRoute = require("./admin/index");
const router = express.Router();

router.use("/users",userRoute);
router.use("/admin",adminRoute);

module.exports = router;