const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    authToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["users","admin"],
      default: "admin"
    }
  },
  { timestamps: true }
);

// Use async/await pattern for pre-save hook. When using an async function
// Mongoose will handle the promise — do not declare `next` or call it.
userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) {
      return;
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  } catch (err) {
    // Throwing the error will reject the save() promise and propagate the error
    throw err;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;