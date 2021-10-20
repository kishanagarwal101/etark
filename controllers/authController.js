const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { createToken } = require("../middlewares/createToken");
const { secret_key } = require('../config/key');
const jwt = require('jsonwebtoken');
module.exports.signup = [
    body("username").not().isEmpty(),
    body("email").not().isEmpty(),
    body("password").isLength({ min: 4 }).withMessage("Password must be atleast 4 Characters"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        try {
            const user = await userModel.create({ username, password, email });
            const token = await createToken(user);
            res.status(201).json({ message: "successfully Registered", token });
        }
        catch (err) {
            let error = err.message;
            if (err.code == 11000) {
                error = "Email already exists";
            }
            res.status(400).json({ error: error });
        }
    }
]
module.exports.login = [

    body("email").not().isEmpty().withMessage("email Field is required"),
    // body("password").isLength({ min: 6 }).withMessage("Password must be atleast 8 Characters"),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const user = await userModel.findOne({ email });
            if (user) {
                const auth = await bcrypt.compare(password, user.password);
                if (auth) {
                    const token = await createToken(user);
                    res.status(201).json({ message: "successfully logged In", token });
                } else {
                    throw Error("Incorrect Password");
                }
            } else {
                throw Error("User Not Found");
            }
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.home = [
    async (req, res) => {
        const token = req.headers.authorization;
        if (token) {
            await verifyToken(token, (user) => {
                if (user == "INVALID_TOKEN") {

                    res.status(401).json({ error: "Authentication Error: Invalid Token" })
                } else {
                    res.status(200).json({ error: "sucesss!: you have access to this route" });
                }
            })
        } else {
            res.status(401).json({ error: "Unauthorized Request" })
        }
    }
]
verifyToken = async (token, next) => {
    await jwt.verify(token, secret_key, async (err, user) => {
        if (err) {
            next("INVALID_TOKEN")
        } else {
            console.log(user)
            userModel.findById(user.userId, function (err, userData) {
                if (err || userData == null) {
                    next("INVALID_TOKEN")
                } else {
                    next(userData)
                }
            })
        }
    });
};