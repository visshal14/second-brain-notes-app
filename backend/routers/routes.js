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
const { ask } = require("../controller/askController")
const { toggleShare, getShared } = require("../controller/publicController")

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
router.put("/notes/:id/share", authToken, toggleShare)

router.get("/embed", getEmbed)
router.get("/public/:shareId", getShared)

router.post("/ask", authToken, ask)

module.exports = router
// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
