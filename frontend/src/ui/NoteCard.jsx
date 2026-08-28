import { Link } from "react-router-dom"

const snippet = (text) => {
    if (!text) {
        return ""
    }
    return text.length > 160 ? text.slice(0, 160) + "..." : text
}

const NoteCard = ({ note, onDelete }) => {
    return (
        <div className="card note-card">
            <div className="note-head">
                <Link to={"/notes/" + note.id} className="note-title">{note.title}</Link>
                {note.is_public && <span className="badge">shared</span>}


            </div>

            <p className="note-body">{snippet(note.content)}</p>



            {note.link && (
                <a className="note-link" href={note.link} target="_blank" rel="noreferrer">
                    {note.link}
                </a>
            )}

            {note.tags && note.tags.length > 0 && (
                <div className="tag-row">
                    {note.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            )}

            <div className="note-actions">
                <Link to={"/notes/" + note.id} className="btn-link">edit</Link>
                <button className="btn-plain btn-small" onClick={() => onDelete(note)}>delete</button>
            </div>
        </div>



    )
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default NoteCard
