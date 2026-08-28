import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createNote, getNote, toggleShare, updateNote } from "../services/notesAPI"
import TagInput from "../ui/TagInput"
import Embed from "../ui/Embed"
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
    const [share, setShare] = useState({ is_public: false, share_url: null })

    const [preview, setPreview] = useState("")

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



                setShare({
                    is_public: note.is_public,
                    share_url: note.is_public
                        ? window.location.origin + "/share/" + note.share_id
                        : null
                })
            })
            .catch((err) => setError(apiMessage(err, "could not load the note")))
            .finally(() => setLoading(false))
    }, [id, isNew])

    useEffect(() => {


        const timer = setTimeout(() => setPreview(link.trim()), 600)
        return () => clearTimeout(timer)

    }, [link])

    const onShare = async () => {
        setError("")
        try {
            const result = await toggleShare(id, !share.is_public)
            setShare({ is_public: result.is_public, share_url: result.share_url })
        } catch (err) {
            setError(apiMessage(err, "could not change the sharing"))
        }


    }

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

                {preview && <Embed url={preview} />}

                <label>Tags</label>
                <TagInput tags={tags} onChange={setTags} />

                <ErrorMessage message={error} />

                {!isNew && (
                    <div className="share-box">
                        <button type="button" className="btn-plain btn-small" onClick={onShare}>
                            {share.is_public ? "stop sharing" : "share this note"}
                        </button>

                        {share.is_public && share.share_url && (
                            <a href={share.share_url} target="_blank" rel="noreferrer" className="note-link">
                                {share.share_url}
                            </a>
                        )}


                        {share.is_public && !share.share_url && (
                            <span className="muted">this note is shared</span>
                        )}
                    </div>
                )}

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
