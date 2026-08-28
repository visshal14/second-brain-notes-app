const axios = require("axios")


const providers = [
    {
        name: "youtube",
        hosts: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"],
        endpoint: "https://www.youtube.com/oembed",
        sizeParams: (maxwidth) => ({ maxwidth, maxheight: Math.round(maxwidth * 9 / 16) })
    },
    {
        name: "twitter",
        hosts: ["twitter.com", "www.twitter.com", "mobile.twitter.com", "x.com", "www.x.com"],
        endpoint: "https://publish.twitter.com/oembed",
        sizeParams: (maxwidth) => ({ maxwidth: Math.min(Math.max(maxwidth, 250), 550) })
    }
]

const findProvider = (url) => {
    let parsed
    try {
        parsed = new URL(url)
    } catch (err) {
        return null
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null
    }

    const provider = providers.find((p) => p.hosts.includes(parsed.hostname.toLowerCase()))
    if (!provider) {
        return null
    }

    if (provider.name === "twitter" && parsed.hostname.toLowerCase().replace("www.", "") === "x.com") {
        parsed.hostname = "twitter.com"
    }

    return { provider, url: parsed.toString() }
}


const getEmbed = async (req, res) => {
    const { url } = req.query

    const asked = Number(req.query.maxwidth)
    const maxwidth = asked > 0 ? Math.min(asked, 1000) : 550

    if (!url) {
        return res.status(400).json({ message: "url is required" })
    }

    const match = findProvider(url)

    if (!match) {
        return res.json({ supported: false, provider: null, url })
    }

    try {
        const response = await axios.get(match.provider.endpoint, {
            params: {
                url: match.url,
                format: "json",
                ...match.provider.sizeParams(maxwidth)
            },
            timeout: 5000
        })

        const data = response.data

        res.json({
            supported: true,
            provider: match.provider.name,
            url: match.url,
            html: data.html,
            title: data.title || null,
            author_name: data.author_name || null,
            thumbnail_url: data.thumbnail_url || null,
            width: data.width || null,
            height: data.height || null
        })
    } catch (err) {
        const status = err.response ? err.response.status : null
        if (status === 400 || status === 403 || status === 404) {
            return res.status(404).json({ message: "this link could not be embedded" })
        }
        console.log("getEmbed error: " + err.message)
        res.status(502).json({ message: "could not reach " + match.provider.name })
    }
}


// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->
module.exports = { getEmbed, findProvider }
