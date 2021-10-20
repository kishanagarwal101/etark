const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/login", authController.login);
router.post("/signup", authController.signup)
router.get("/home", authController.home)
module.exports = router;