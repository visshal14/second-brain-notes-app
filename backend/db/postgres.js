const { Pool } = require("pg")


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})


pool.connect((err, client, done) => {
    if (err) {
        return console.log("error in db connection")
    }
    console.log("Connected successfully")
    done()
})

module.exports = pool
