const jwt = require("jsonwebtoken")



const authToken = (req, res, next) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "no token provided" })
    }

    const token = header.split(" ")[1]



    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { id: payload.id }
        next()

    } catch (err) {
        res.status(401).json({ message: "invalid or expired token" })
    }
}

module.exports = authToken
// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->