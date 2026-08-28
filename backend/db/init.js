// runs schema.sql on the database in DATABASE_URL
require("dotenv").config()
const fs = require("fs")
const path = require("path")
const pool = require("./postgres")


const run = async () => {
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8")
    try {
        await pool.query(schema)
        console.log("schema applied")
    } catch (err) {
        console.log("error applying schema: " + err.message)
    }
    await pool.end()
}

run()
