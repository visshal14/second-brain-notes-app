const {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getTags
} = require("../models/note")


const cleanTags = (tags) => {
    if (tags === undefined) {
        return undefined
    }

    const list = Array.isArray(tags) ? tags : String(tags).split(",")

    return [...new Set(
        list
            .map((tag) => String(tag).trim().toLowerCase())
            .filter((tag) => tag.length > 0)
    )]
}


const isValidId = (id) => /^\d+$/.test(id)


const addNote = async (req, res) => {
    const { title, content, link, tags } = req.body

    if (!title || !String(title).trim()) {
        return res.status(400).json({ message: "title is required" })
    }

    try {
        const note = await createNote(req.user.id, {
            title: String(title).trim(),
            content,
            link,
            tags: cleanTags(tags) || []
        })
        res.status(201).json(note)
    } catch (err) {
        console.log("addNote error: " + err.message)
        res.status(500).json({ message: "could not save the note" })
    }
}


const listNotes = async (req, res) => {
    try {
        const notes = await getNotes(req.user.id, {
            search: req.query.search,
            tag: req.query.tag ? String(req.query.tag).trim().toLowerCase() : undefined
        })
        res.json(notes)
    } catch (err) {
        console.log("listNotes error: " + err.message)
        res.status(500).json({ message: "could not get the notes" })
    }
}

const getNote = async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(404).json({ message: "note not found" })
    }

    try {
        const note = await getNoteById(req.params.id, req.user.id)
        if (!note) {
            return res.status(404).json({ message: "note not found" })
        }
        res.json(note)
    } catch (err) {
        console.log("getNote error: " + err.message)
        res.status(500).json({ message: "could not get the note" })
    }
}

const editNote = async (req, res) => {
    const { title, content, link, tags } = req.body

    if (!isValidId(req.params.id)) {
        return res.status(404).json({ message: "note not found" })
    }

    if (title !== undefined && !String(title).trim()) {
        return res.status(400).json({ message: "title cannot be empty" })
    }

    try {
        const note = await updateNote(req.params.id, req.user.id, {
            title: title !== undefined ? String(title).trim() : undefined,
            content,
            link,
            tags: cleanTags(tags)
        })
        if (!note) {
            return res.status(404).json({ message: "note not found" })
        }
        res.json(note)
    } catch (err) {
        console.log("editNote error: " + err.message)
        res.status(500).json({ message: "could not update the note" })
    }
}

const removeNote = async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(404).json({ message: "note not found" })
    }

    try {
        const deleted = await deleteNote(req.params.id, req.user.id)
        if (!deleted) {
            return res.status(404).json({ message: "note not found" })
        }
        res.json({ message: "note deleted", id: deleted.id })
    } catch (err) {
        console.log("removeNote error: " + err.message)
        res.status(500).json({ message: "could not delete the note" })
    }
}

// every tag the user has, for the filter row on the notes page
const listTags = async (req, res) => {
    try {
        res.json(await getTags(req.user.id))
    } catch (err) {
        console.log("listTags error: " + err.message)
        res.status(500).json({ message: "could not get the tags" })
    }
}


// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
module.exports = {
    addNote,
    listNotes,
    getNote,
    editNote,
    removeNote,
    listTags
}
