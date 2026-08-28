import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createNote, getNote, updateNote } from "../services/notesAPI"
import TagInput from "../ui/TagInput"
import Loading from "../ui/Loading"
import ErrorMessage from "../ui/ErrorMessage"
import apiMessage from "../utils/apiMessage"


const NoteEditor = () => {
    const { id } = useParams()
    const isNew = id === undefined

    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [link, setLink] = useState("")
    const [tags, setTags] = useState([])

    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)

    const [error, setError] = useState("")

    useEffect(() => {
        if (isNew) {
            return
        }

        getNote(id)
            .then((note) => {


                setTitle(note.title)
                setContent(note.content || "")
                setLink(note.link || "")
                setTags(note.tags || [])
            })
            .catch((err) => setError(apiMessage(err, "could not load the note")))
            .finally(() => setLoading(false))
    }, [id, isNew])

    const onSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!title.trim()) {

            return setError("title is required")
        }

        setSaving(true)


        const payload = { title: title.trim(), content, link: link.trim() || null, tags }

        try {
            if (isNew) {
                await createNote(payload)
            } else {
                await updateNote(id, payload)
            }
            navigate("/")
        } catch (err) {
            setError(apiMessage(err, "could not save the note"))
            setSaving(false)
        }
    }

    if (loading) {

        return <Loading text="loading the note..." />
    }

    return (
        <div className="card">
            <h2>{isNew ? "New note" : "Edit note"}</h2>

            <form onSubmit={onSubmit}>
                <label htmlFor="title">Title</label>
                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    rows="8"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <label htmlFor="link">Link (youtube or x, optional)</label>


                <input
                    id="link"
                    value={link}
                    placeholder="https://youtu.be/..."
                    onChange={(e) => setLink(e.target.value)}
                />

                <label>Tags</label>
                <TagInput tags={tags} onChange={setTags} />

                <ErrorMessage message={error} />

                <div className="editor-actions">
                    <button type="submit" disabled={saving}>
                        {saving ? "saving..." : "Save"}
                    </button>
                    <button type="button" className="btn-plain" onClick={() => navigate("/")}>
                        cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default NoteEditor
