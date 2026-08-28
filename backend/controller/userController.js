const { findUserById } = require("../models/user")


const getMe = async (req, res) => {
    try {
        const user = await findUserById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.json(user)
    } catch (err) {
        console.log("getMe error: " + err.message)
        res.status(500).json({ message: "could not get the user" })
    }
}

module.exports = { getMe }
