const express = require("express");
const app = express();
const dbConnection = require("./config/db");
const port = 8000;

dbConnection();

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})