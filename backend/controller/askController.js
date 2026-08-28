const axios = require("axios")
const { getNotes } = require("../models/note")

const GROQ_URL = process.env.GROQ_URL || "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b"

// how much of the notes gets sent along with the question
const MAX_NOTES = 25
const MAX_NOTE_CHARS = 800
const MAX_TOTAL_CHARS = 12000




const buildContext = (notes) => {
    const used = []
    let text = ""

    for (const note of notes.slice(0, MAX_NOTES)) {
        let body = note.content || ""
        if (body.length > MAX_NOTE_CHARS) {
            body = body.slice(0, MAX_NOTE_CHARS) + "..."
        }

        const block = `Note ${note.id}: ${note.title}\n` +
            (note.tags && note.tags.length ? `Tags: ${note.tags.join(", ")}\n` : "") +
            (note.link ? `Link: ${note.link}\n` : "") +
            `${body}\n\n`

        if (text.length + block.length > MAX_TOTAL_CHARS) {
            break
        }

        text += block
        used.push({ id: note.id, title: note.title })
    }

    return { text, used }
}



const ask = async (req, res) => {
    const { question } = req.body

    if (!question || !String(question).trim()) {
        return res.status(400).json({ message: "question is required" })
    }

    if (String(question).length > 500) {
        return res.status(400).json({ message: "question is too long" })
    }

    if (!process.env.GROQ_API_KEY) {
        return res.status(503).json({ message: "the ai is not configured on the server" })
    }

    try {
        const notes = await getNotes(req.user.id)

        if (notes.length === 0) {
            return res.json({
                answer: "You have not saved any notes yet, so there is nothing to answer from.",
                sources: []
            })
        }

        const { text, used } = buildContext(notes)

        const response = await axios.post(
            GROQ_URL,
            {
                model: GROQ_MODEL,
                temperature: 0.2,
                messages: [
                    {
                        role: "system",
                        content: "You answer questions using only the notes the user saved. " +
                            "If the notes do not contain the answer, say so instead of guessing. " +
                            "Keep the answer short and mention the note titles you used."
                    },
                    {
                        role: "user",
                        content: `Here are my notes:\n\n${text}\nQuestion: ${String(question).trim()}`
                    }
                ]
            },
            {
                headers: { Authorization: "Bearer " + process.env.GROQ_API_KEY },
                timeout: 20000
            }
        )

        const answer = response.data.choices &&
            response.data.choices[0] &&
            response.data.choices[0].message.content

        if (!answer) {
            return res.status(502).json({ message: "the ai returned an empty answer" })
        }


        res.json({ answer: answer.trim(), sources: used })
    } catch (err) {
        const status = err.response ? err.response.status : null

        if (status === 401 || status === 403) {
            console.log("ask error: groq rejected the api key")
            return res.status(503).json({ message: "the ai is not configured on the server" })
        }

        if (status === 429) {
            return res.status(429).json({ message: "too many questions, try again in a minute" })
        }

        console.log("ask error: " + err.message)
        res.status(502).json({ message: "could not reach the ai" })
    }
}
// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->


module.exports = { ask, buildContext }
