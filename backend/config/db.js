const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async() => {

    try{
        await mongoose.connect(process.env.MONGO_URL,{
        dbName: "SidhaReporting",
    });
    console.log("Successfully Connected to the database");

    }catch(error){
        console.log("Error in creating the database",error);
    }
}

module.exports = dbConnection;