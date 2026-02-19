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

// for routes to accept the json files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const corsOptions = {
  origin: [process.env.FRONTEND_URL], // Allow specific origin from environment variable
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
  exposedHeaders: ["Content-Disposition", "Content-Type"],
  allowedHeaders: ["Authorization", "Content-Type"], // Explicitly allow Authorization header
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Apply CORS middleware
app.use(cors(corsOptions));


//for using passport
app.use(passport.initialize());
app.use(passport.session());
dbConnection();

app.use("/apis/v1",require("./routes"));


app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})