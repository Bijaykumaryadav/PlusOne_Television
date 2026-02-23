const passport = require("passport");
const User = require("../models/userSchema");
const crypto = require("crypto");

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    console.log(user);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "http://localhost:8000/apis/v1/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      try {
        //Find or create a user based on the Google profile
        const user = await User.findOne({
          email: profile.emails[0].value,
        });
        const profileImage = profile.photos && profile.photos[0].value;
        if (user) {
          //Serialize user into the session
          return done(null, user);
        } else {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
            profileImage,
            isVerified: true,
            authToken: crypto.randomBytes(32).toString("hex"),
          });
          await newUser.save();
          //Serialize user into the session
          return done(null, newUser);
        }
      } catch (error) {
        console.log(`Error in authentication using Google: ${error}`);
        return done(error);
      }
    }
  )
);