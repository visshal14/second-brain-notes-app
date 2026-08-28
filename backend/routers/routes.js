const express = require("express")
const register = require("../middleware/register")
const login = require("../middleware/login")
const authToken = require("../middleware/authToken")
const { getMe } = require("../controller/userController")

const router = express.Router()


router.post("/auth/register", register)
router.post("/auth/login", login)

router.get("/auth/me", authToken, getMe)

// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
module.exports = router
