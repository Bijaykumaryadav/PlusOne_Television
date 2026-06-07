const express = require("express");
const userRoute = require("./users/index");
const adminRoute = require("./admins/index");
const publicArticlesRoute = require("./articles");
const paymentsRoute = require("./payments");
const adsRoute = require("./ads");
const seoRoute = require("./seo");
const contactsRoute = require("./contacts");
const router = express.Router();

router.use("/users",userRoute);
router.use("/admin",adminRoute);
router.use("/articles", publicArticlesRoute);
router.use("/payment", paymentsRoute);
router.use("/ads", adsRoute);
router.use("/seo", seoRoute);
router.use("/contacts", contactsRoute);

module.exports = router; 