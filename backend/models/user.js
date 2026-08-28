const pool = require("../db/postgres")


const createUser = async (name, email, password) => {
    const result = await pool.query(
        "insert into users (name, email, password) values ($1, $2, $3) returning id, name, email, created_at",
        [name, email, password]
    )
    return result.rows[0]
}

// includes the password hash, only used by login
const findUserByEmail = async (email) => {
    const result = await pool.query(
        "select id, name, email, password, created_at from users where email = $1",
        [email]
    )
    return result.rows[0]
}

const findUserById = async (id) => {
    const result = await pool.query(
        "select id, name, email, created_at from users where id = $1",
        [id]
    )
    return result.rows[0]
}


module.exports = {
    createUser,
    findUserByEmail,
    findUserById
}
