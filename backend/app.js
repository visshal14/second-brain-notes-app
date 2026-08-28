const express = require("express")
require("dotenv").config()
const cors = require("cors")

const app = express()
require("./db/postgres")
const routes = require("./routers/routes")

const port = process.env.PORT || 3001

app.use(cors({
    origin: "*",
    optionSuccessStatus: 200
}))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.get("/ping", (req, res) => {
    res.sendStatus(200)
})

app.use("/api", routes)

app.listen(port, () => {
    console.log("server started on port " + port)
})

// <!-- ℑ♑︎  亖⌽⎭🂱⎶☀️☀️⌶⍱   -->