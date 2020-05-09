const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
//Connect To DB
mongoose.connect(
    process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log("connected to DB");
    }
);

//Import routes
const authRoute = require("./routes/auth");
const homeRoute = require("./routes/home");
const postRoute = require("./routes/posts");

//Middleware
app.use(express.json());

//Route Middlewares
app.use("/api/user", authRoute);

app.use("", homeRoute);

app.use("/api/posts", postRoute);

app.listen(3000, () => {
    console.log("Server is running");
});