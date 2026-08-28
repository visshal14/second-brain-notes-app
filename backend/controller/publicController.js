const { getNoteById, setNoteShare, getPublicNote } = require("../models/note")


const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

const shareLink = (shareId) => {
    const base = process.env.FRONTEND_URL || ""
    return base.replace(/\/$/, "") + "/share/" + shareId
}


const toggleShare = async (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(404).json({ message: "note not found" })
    }

    try {
        const note = await getNoteById(req.params.id, req.user.id)
        if (!note) {
            return res.status(404).json({ message: "note not found" })
        }

        const isPublic = req.body.is_public === undefined
            ? !note.is_public
            : req.body.is_public === true || req.body.is_public === "true"

        const updated = await setNoteShare(note.id, req.user.id, isPublic)

        res.json({
            id: updated.id,
            is_public: updated.is_public,
            share_id: updated.share_id,

            share_url: updated.is_public ? shareLink(updated.share_id) : null
        })
    } catch (err) {
        console.log("toggleShare error: " + err.message)
        res.status(500).json({ message: "could not change the sharing" })
    }
}


const getShared = async (req, res) => {
    if (!isUuid(req.params.shareId)) {
        return res.status(404).json({ message: "this note is not shared" })
    }

    try {
        const note = await getPublicNote(req.params.shareId)

        if (!note) {
            return res.status(404).json({ message: "this note is not shared" })
        }
        res.json(note)
    } catch (err) {
        console.log("getShared error: " + err.message)
        res.status(500).json({ message: "could not get the note" })
    }
}


// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
module.exports = { toggleShare, getShared }
