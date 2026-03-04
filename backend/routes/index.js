const express = require("express");
const userRoute = require("./users/index");
const adminRoute = require("./admins/index");
const publicArticlesRoute = require("./articles");
const paymentsRoute = require("./payments");
const router = express.Router();

router.use("/users",userRoute);
router.use("/admin",adminRoute);
router.use("/articles", publicArticlesRoute);
router.use("/payments", paymentsRoute);

module.exports = router; 