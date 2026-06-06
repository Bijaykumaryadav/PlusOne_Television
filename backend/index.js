const express = require("express");
const app = express();
const dbConnection = require("./config/db");
const passport = require("passport");
const session = require("express-session");
require("./middleware/passport-google-strategy");
require("./middleware/passport-jwt-strategy");
const cors = require("cors");
const path = require("path");
// index.js – relevant excerpt
let port;
if (process.env.NODE_ENV === 'development') {
  port = 8000;      // always use 8000 locally
} else {
  port = process.env.PORT || 8000;
}


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://sidhareporting.com",
      "https://www.sidhareporting.com",
      "http://localhost:5173",
      "http://localhost:3000",
      // For development only
      "http://72.60.223.137:5173",
      "http://72.60.223.137:3000"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});