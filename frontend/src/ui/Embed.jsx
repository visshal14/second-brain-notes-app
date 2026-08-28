import { useEffect, useState } from "react"
import { getEmbed } from "../services/embedAPI"
import Loading from "./Loading"

const Embed = ({ url }) => {
    const [data, setData] = useState(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let alive = true
        setData(null)
        setFailed(false)

        getEmbed(url)
            .then((result) => {
                if (alive) {
                    setData(result)
                }
            })
            .catch(() => {
                if (alive) {
                    setFailed(true)
                }
            })


        return () => {
            alive = false
        }
    }, [url])


    useEffect(() => {
        if (!data || data.provider !== "twitter") {
            return
        }

        if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load()
            return
        }



        const found = data.html.match(/<script[^>]+src="([^"]+)"/)
        const src = found ? found[1] : "https://platform.x.com/widgets.js"

        if (document.querySelector('script[src="' + src + '"]')) {
            return
        }

        const script = document.createElement("script")
        script.src = src
        script.async = true
        document.body.appendChild(script)
    }, [data])

    if (!url) {
        return null
    }


    if (failed || (data && !data.supported)) {
        return (
            <a href={url} target="_blank" rel="noreferrer" className="note-link">
                {url}
            </a>
        )
    }

    if (!data) {
        return <Loading text="loading preview..." />
    }



    return <div className="embed" dangerouslySetInnerHTML={{ __html: data.html }} />
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default Embed
