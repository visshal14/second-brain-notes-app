import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPublicNote } from "../services/publicAPI"
import Embed from "../ui/Embed"
import Loading from "../ui/Loading"
import ErrorMessage from "../ui/ErrorMessage"
import apiMessage from "../utils/apiMessage"



const PublicNote = () => {
    const { shareId } = useParams()

    const [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        getPublicNote(shareId)
            .then((data) => setNote(data))
            .catch((err) => setError(apiMessage(err, "this note is not shared")))
            .finally(() => setLoading(false))
    }, [shareId])

    if (loading) {
        return <Loading text="loading the note..." />
    }

    if (error) {
        return (
            <div>
                <ErrorMessage message={error} />
                <p className="muted">
                    the link may be wrong, or the owner stopped sharing it. <Link to="/">go home</Link>
                </p>
            </div>
        )
    }

    return (
        <div className="card">
            <h2>{note.title}</h2>
            <p className="muted">shared by {note.author}</p>

            {note.content && <p className="note-body">{note.content}</p>}

            {note.link && <Embed url={note.link} />}



            {note.tags && note.tags.length > 0 && (
                <div className="tag-row">
                    {note.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            )}

            <p className="muted read-only">this is a read only copy</p>
        </div>
    )
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default PublicNote
