import { useState } from "react"
import { Link } from "react-router-dom"
import { askNotes } from "../services/askAPI"
import ErrorMessage from "../ui/ErrorMessage"
import apiMessage from "../utils/apiMessage"

const Ask = () => {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState(null)
    const [sources, setSources] = useState([])
    const [asking, setAsking] = useState(false)
    const [error, setError] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!question.trim()) {
            return setError("type a question first")
        }

        setAsking(true)
        setAnswer(null)

        try {
            const result = await askNotes(question.trim())
            setAnswer(result.answer)
            setSources(result.sources || [])
        } catch (err) {
            setError(apiMessage(err, "could not ask your notes"))
        } finally {
            setAsking(false)
        }
    }

    return (
        <div>
            <div className="card">
                <h2>Ask your notes</h2>
                <p className="muted">
                    answers come from your own notes only, nothing else.
                </p>

                <form onSubmit={onSubmit}>
                    <textarea
                        rows="3"
                        value={question}
                        placeholder="what did I save about postgres indexes?"
                        onChange={(e) => setQuestion(e.target.value)}
                        maxLength={500}
                    />

                    <ErrorMessage message={error} />

                    <div className="editor-actions">
                        <button type="submit" disabled={asking}>
                            {asking ? "thinking..." : "Ask"}
                        </button>
                        <span className="muted">{question.length}/500</span>
                    </div>
                </form>
            </div>

            {answer && (
                <div className="card answer-card">
                    <p className="answer">{answer}</p>

                    {sources.length > 0 && (
                        <div className="sources">
                            <p className="muted">based on these notes:</p>
                            <div className="tag-row">
                                {sources.map((note) => (
                                    <Link key={note.id} to={"/notes/" + note.id} className="tag">
                                        {note.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Ask
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 