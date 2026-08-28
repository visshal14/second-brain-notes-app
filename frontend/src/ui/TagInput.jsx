import { useState } from "react"


const TagInput = ({ tags, onChange }) => {
    const [draft, setDraft] = useState("")

    const addTag = (value) => {
        const tag = value.trim().toLowerCase()
        if (tag && !tags.includes(tag)) {
            onChange([...tags, tag])
        }
        setDraft("")
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {



            e.preventDefault()
            addTag(draft)
        }

        if (e.key === "Backspace" && !draft && tags.length) {
            onChange(tags.slice(0, -1))
        }
    }

    return (
        <div>
            <div className="tag-row">
                {tags.map((tag) => (
                    <span key={tag} className="tag">
                        {tag}
                        <button
                            type="button"
                            className="tag-x"
                            onClick={() => onChange(tags.filter((t) => t !== tag))}
                            aria-label={"remove " + tag}
                        >
                            x
                        </button>
                    </span>


                ))}
            </div>

            <input
                value={draft}
                placeholder="add a tag and press enter"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={() => addTag(draft)}
            />
        </div>
    )
}

export default TagInput
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 