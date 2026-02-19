const dotenv = require("dotenv");
dotenv.config();
const { sendResponse } = require("../../utils/sendResponse");
const {
  setInitialProfilePicture,
} = require("../../utils/setInitialProfilePicture");
const Otp = require("../../models/otpSchema");
const User = require("../../models/userSchema");
const { verifyUserEmail } = require("../../mailers/verifyUserEmail");
const { generateOTP } = require("../../utils/generateOtp");
const { resetPasswordEmail } = require("../../mailers/resetPasswordEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendResponse(
        res,
        404,
        false,
        "Please fill all the details",
        null,
        null
      );
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        const otp = await generateOTP(user._id); 
        user.otp = otp;
        await user.save();
        await verifyUserEmail(user, otp);
        return sendResponse(
          res,
          409,
          false,
          "Please verify your email to continue"
        );
      }
      return sendResponse(
        res,
        409,
        false,
        "Account already exists",
        null,
        null
      );
    }

    // Create new user
    const profileImage = setInitialProfilePicture(name);
    user = new User({
      name,
      email,
      password,
      authToken: crypto.randomBytes(32).toString("hex"),
      profileImage,
    });

    const otp = await generateOTP(user._id); // Generate OTP and link to user
    user.otp = otp; // Save OTP in user schema (optional)
    await user.save();

    // Save OTP in Otp collection
    // await Otp.create({ user: user._id, otp });

    // Send OTP via email
    await verifyUserEmail(user, otp);

    return sendResponse(
      res,
      200,
      true,
      `OTP sent to ${email}`,
      { email },
      null
    );
  } catch (error) {
    console.log("Error is:", error);
    return sendResponse(res, 500, false, "Internal server error", null, error);
  }
};

module.exports.verifyUser = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return sendResponse(res, 404, false, "OTP not found", null, null);
    }

    // Find the OTP in the Otp collection
    const otpRecord = await Otp.findOne({ otp });
    if (!otpRecord) {
      return sendResponse(
        res,
        404,
        false,
        "Invalid OTP or Expired Otp",
        null,
        null
      );
    }

    // Find the user associated with the OTP
    const user = await User.findById(otpRecord.user);
    if (!user) {
      return sendResponse(res, 404, false, "User does not exist", null, null);
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Optionally, delete the OTP record after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });

    return sendResponse(
      res,
      200,
      true,
      "Email verified successfully",
      null,
      null
    );
  } catch (error) {
    console.error(`Error in OTP verification: ${error}`);
    return sendResponse(res, 500, false, "OTP verification failed", null, {
      error,
    });
  }
};

module.exports.resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (user.isVerified) {
      return sendResponse(res, 400, false, "User is already verified");
    }

    const otp = await generateOTP(user._id);
    await Otp.updateOne({ user: user._id }, { otp }, { upsert: true });

    // Send the OTP email
    await verifyUserEmail(user, otp);

    return sendResponse(res, 200, true, `Verification code resent to ${email}`);
  } catch (error) {
    console.error("Error resending signup OTP:", error);
    return sendResponse(
      res,
      500,
      false,
      "Failed to resend verification code for signup"
    );
  }
};

module.exports.resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, false, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const otp = await generateOTP(user._id);
    await Otp.updateOne({ user: user._id }, { otp }, { upsert: true });

    // Send the OTP email for password reset
    resetPasswordEmail(user, otp);
    return sendResponse(res, 200, true, `Reset code resent to ${email}`);
  } catch (error) {
    console.error("Error resending reset OTP:", error);
    return sendResponse(res, 500, false, "Failed to resend reset code");
  }
};

//Sign in user
module.exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return sendResponse(res, 400, false, "Please fill all the details", null, null);
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User does not exist");
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      const otp = await generateOTP(user._id);
      verifyUserEmail(user, otp);
      return sendResponse(
        res,
        401,
        false,
        "Email not verified. Verification email has been resent.",
        null,
        null
      );
    }

    // Check if the password matches
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return sendResponse(res, 409, false, "Password mismatch");
    }

    // Generate JWT token
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    // Successful login
    return sendResponse(res, 200, true, "Login successful", { token }, null);
  } catch (error) {
    console.error(`Error in login: ${error}`);
    return sendResponse(res, 500, false, "Error in login", null, { error });
  }
};


module.exports.resetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(
        res,
        400,
        false,
        "Please Enter the associated Email with account"
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404, false, "Account doesnot exist");
    }

    const otp = await generateOTP(user._id);
    user.otp = otp;
    await user.save();
    resetPasswordEmail(user, otp);
    return sendResponse(
      res,
      200,
      true,
      "Reset password email sent successfully"
    );
  } catch (error) {
    console.log("Error in sending reset password email", error);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports.verifyResetOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return sendResponse(res, 400, false, "OTP is required");
    }

    // Find the OTP in the Otp collection
    const otpRecord = await Otp.findOne({ otp });
    if (!otpRecord) {
      return sendResponse(res, 404, false, "Invalid OTP or OTP has expired");
    }

    const user = await User.findById(otpRecord.user);
    if (!user) {
      return sendResponse(res, 404, false, "User does not exist");
    }

    // Generate a token with the user's ID, signed with a secret and short expiration
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY, // Securely store this secret in environment variables
      { expiresIn: "5m" } // Token valid for 10 minutes
    );

    // Remove OTP as it's no longer needed
    await Otp.deleteOne({ _id: otpRecord._id });

    return sendResponse(res, 200, true, "OTP verified successfully", { token });
  } catch (error) {
    console.error(`Error verifying OTP: ${error}`);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, 401, false, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decoded); // Check that _id is available

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return sendResponse(res, 400, false, "Passwords do not match");
    }

    // Use decoded._id to find the user
    const user = await User.findById(decoded._id);
    if (!user) {
      console.log("User not found for ID:", decoded._id); // Log _id if not found
      return sendResponse(res, 404, false, "User not found");
    }

    user.password = password; // Assuming password will be hashed in pre-save middleware
    await user.save();

    return sendResponse(res, 200, true, "Password updated successfully");
  } catch (error) {
    console.error("Error updating password:", error);
    return sendResponse(res, 500, false, "Failed to update password");
  }
};

module.exports.googleSignUp = function (req, res) {
  const { _id, name, email ,profileImage } = req.user;
  const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
  // console.log(token);
  const userData = {
    id: _id,
    name,
    email,
    profileImage
    // jwttoken,
  };
  console.log(userData);
  // const token = new URLSearchParams(jwttoken).toString();

  res.redirect(
    `${process.env.FRONTEND_URL}/users/auth/googleCallback?token=${encodeURIComponent(token)}`
  );
};

// send user details
module.exports.sendUserDetails = async (req, res) => {
  try {
    // Retrieve the token from the authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Assuming "Bearer <token>"
    console.log("token is",token);

    // Check if token is provided
    if (!token) {
      return sendResponse(res, 401, false, "No token provided", null, null);
    }

    console.log("Verifying token...");
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use your secret key here
    console.log("decoded",decoded);
    const userId = decoded._id;
    console.log(userId);

    // Find the user in the database
    const user = await User.findById(userId).select("name email profileImage role");
    console.log(user);

    if (user) {
      return sendResponse(res, 200, true, "User found", { user , token }, null);
    }
    
    return sendResponse(res, 404, false, "User not found. Sign up please.", null, null);
  } catch (error) {
    console.error(`Error in sending user details: ${error}`);
    // Handle token verification error (e.g., expired or invalid token)
    if (error.name === 'JsonWebTokenError') {
      return sendResponse(res, 401, false, "Invalid token", null, null);
    }
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, false, "Token has expired", null, null);
    }

    return sendResponse(res, 500, false, "Error in fetching user details", null, { error });
  }
};