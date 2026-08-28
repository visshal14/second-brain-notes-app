import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { deleteNote, listNotes, listTags } from "../services/notesAPI"
import NoteCard from "../ui/NoteCard"
import Loading from "../ui/Loading"
import ErrorMessage from "../ui/ErrorMessage"
import apiMessage from "../utils/apiMessage"

const Notes = () => {
    const [notes, setNotes] = useState([])
    const [tags, setTags] = useState([])
    const [search, setSearch] = useState("")
    const [activeTag, setActiveTag] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")



    useEffect(() => {


        const timer = setTimeout(() => {

            setError("")
            listNotes({ search, tag: activeTag })
                .then((data) => setNotes(data))
                .catch((err) => setError(apiMessage(err, "could not load your notes")))
                .finally(() => setLoading(false))
        }, 300)

        return () => clearTimeout(timer)
    }, [search, activeTag])

    const loadTags = () => {
        listTags()
            .then((data) => setTags(data))
            .catch(() => setTags([]))
    }

    useEffect(loadTags, [])

    const onDelete = async (note) => {
        if (!window.confirm("delete \"" + note.title + "\"?")) {
            return
        }

        try {
            await deleteNote(note.id)
            setNotes((current) => current.filter((n) => n.id !== note.id))



            loadTags()
        } catch (err) {
            setError(apiMessage(err, "could not delete the note"))
        }
    }

    return (
        <div>
            <div className="toolbar">
                <input
                    className="search"
                    value={search}
                    placeholder="search your notes"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Link to="/notes/new"><button>new note</button></Link>
            </div>


            {tags.length > 0 && (
                <div className="tag-row filter-row">
                    <button
                        className={"tag tag-button" + (activeTag === "" ? " tag-active" : "")}
                        onClick={() => setActiveTag("")}
                    >
                        all
                    </button>

                    {tags.map((tag) => (
                        <button
                            key={tag}
                            className={"tag tag-button" + (activeTag === tag ? " tag-active" : "")}
                            onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <ErrorMessage message={error} />

            {loading && <Loading text="loading your notes..." />}

            {!loading && notes.length === 0 && (
                <p className="muted">
                    {search || activeTag
                        ? "nothing matches that."
                        : "no notes yet, start with the new note button."}
                </p>
            )}

            <div className="note-list">
                {notes.map((note) => (
                    <NoteCard key={note.id} note={note} onDelete={onDelete} />
                ))}
            </div>
        </div>
    )
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default Notes
