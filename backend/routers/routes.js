const express = require("express")
const register = require("../middleware/register")
const login = require("../middleware/login")
const authToken = require("../middleware/authToken")
const { getMe } = require("../controller/userController")
const {
    addNote,
    listNotes,
    getNote,
    editNote,
    removeNote,
    listTags
} = require("../controller/noteController")
const { getEmbed } = require("../controller/embedController")

const router = express.Router()


router.post("/auth/register", register)
router.post("/auth/login", login)

router.get("/auth/me", authToken, getMe)


router.get("/tags", authToken, listTags)

router.post("/notes", authToken, addNote)
router.get("/notes", authToken, listNotes)
router.get("/notes/:id", authToken, getNote)
router.put("/notes/:id", authToken, editNote)
router.delete("/notes/:id", authToken, removeNote)
router.get("/embed", getEmbed)

module.exports = router
// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
