
const mongoose = require("mongoose");


async function connectDB() {

    await mongoose.connect("mongodb+srv://pavanlanetteam6_db_user:u8yUbVggIIMLmGse@cluster0.a0cn2tf.mongodb.net/")

    console.log("Connected to DB")

}


module.exports = connectDB;