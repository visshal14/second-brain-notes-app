const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createUser, findUserByEmail } = require("../models/user")


const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "name, email and password are required" })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "password must be at least 6 characters" })
    }

    try {
        const existing = await findUserByEmail(email)
        if (existing) {
            return res.status(409).json({ message: "this email is already registered" })
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await createUser(name, email, hashed)

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.status(201).json({ user, token })
    } catch (err) {
        console.log("register error: " + err.message)
        res.status(500).json({ message: "could not register" })
    }
}

module.exports = register
