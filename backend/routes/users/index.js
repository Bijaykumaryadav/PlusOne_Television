const express = require("express");
const {
  signUp,
  verifyUser,
  signInUser,
  googleSignUp,
  resetPasswordEmail,
  verifyResetOtp,
  updatePassword,
  resendSignupOtp,
  resendResetOtp,
  sendUserDetails,
} = require("../../controllers/users/user-controller");
const passport = require("passport");

const router = express.Router();

router.post("/signup", signUp);
router.post("/verify", verifyUser);
router.post("/resend-signupotp", resendSignupOtp);
router.post("/resend-resetotp", resendResetOtp);
router.post("/signin", signInUser);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleSignUp
);

router.post("/reset-password", resetPasswordEmail);
router.post("/verify-resetotp", verifyResetOtp);
router.post("/update-password",updatePassword);

router.get(
  "/auth",
  passport.authenticate("jwt", { session: false }),
  sendUserDetails
);

module.exports = router;