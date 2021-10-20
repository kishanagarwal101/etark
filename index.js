require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const authRoute = require("./routes/authRoutes");
const uri = "mongodb+srv://kishan:abcd123@cluster0.vdidc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
).then(() => {
    console.log("Connected to Hsv DB!!!");
})
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");

    next();
});
app.get("/test", (req, res) => {
    res.json({
        code: 200,
        errCode: null,
        message: `Server Running on Port: ${PORT}`,
    });
});
app.use("/", authRoute);
server.listen(PORT, () => {
    console.log(`PORT: ${PORT}`);
});