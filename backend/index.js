const express = require("express");
const app = express();
const dbConnection = require("./config/db");
const port = 8000;
const passport = require("passport");
const session = require("express-session");
require("./middleware/passport-google-strategy");
require("./middleware/passport-jwt-strategy");
const cors = require("cors");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
  exposedHeaders: ["Content-Disposition", "Content-Type"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Add express-session BEFORE passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true only in production (HTTPS)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ✅ Passport middleware AFTER session
app.use(passport.initialize());
app.use(passport.session());

dbConnection();

app.use("/apis/v1", require("./routes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});