const pool = require("../db/postgres")


const createNote = async (userId, { title, content, link, tags }) => {
    const result = await pool.query(
        `insert into notes (user_id, title, content, link, tags)
         values ($1, $2, $3, $4, $5)
         returning *`,
        [userId, title, content || "", link || null, tags || []]
    )
    return result.rows[0]
}

// search matches the title or the content, tag is an exact tag match
const getNotes = async (userId, { search, tag } = {}) => {
    const where = ["user_id = $1"]
    const values = [userId]

    if (search) {
        values.push(`%${search}%`)
        where.push(`(title ilike $${values.length} or content ilike $${values.length})`)
    }

    if (tag) {
        values.push([tag])
        where.push(`tags @> $${values.length}`)
    }

    const result = await pool.query(
        `select * from notes where ${where.join(" and ")} order by updated_at desc`,
        values
    )
    return result.rows
}

const getNoteById = async (id, userId) => {
    const result = await pool.query(
        "select * from notes where id = $1 and user_id = $2",
        [id, userId]
    )
    return result.rows[0]
}

// only the fields that were sent get updated, so a note can be edited partially
const updateNote = async (id, userId, fields) => {
    const allowed = ["title", "content", "link", "tags"]
    const sets = []
    const values = [id, userId]

    for (const key of allowed) {
        if (fields[key] !== undefined) {
            values.push(fields[key])
            sets.push(`${key} = $${values.length}`)
        }
    }

    if (sets.length === 0) {
        return getNoteById(id, userId)
    }

    const result = await pool.query(
        `update notes set ${sets.join(", ")}, updated_at = now()
         where id = $1 and user_id = $2
         returning *`,
        values
    )
    return result.rows[0]
}

const deleteNote = async (id, userId) => {
    const result = await pool.query(
        "delete from notes where id = $1 and user_id = $2 returning id",
        [id, userId]
    )
    return result.rows[0]
}

// all the distinct tags of a user, for the tag filter on the frontend
const getTags = async (userId) => {
    const result = await pool.query(
        `select distinct unnest(tags) as tag from notes where user_id = $1 order by tag`,
        [userId]
    )
    return result.rows.map((row) => row.tag)
}

const setNoteShare = async (id, userId, isPublic) => {
    const result = await pool.query(
        `update notes set is_public = $3, updated_at = now()
         where id = $1 and user_id = $2
         returning *`,
        [id, userId, isPublic]
    )
    return result.rows[0]
}

// read only lookup for the public share link, no user id needed
const getPublicNote = async (shareId) => {
    const result = await pool.query(
        `select n.id, n.title, n.content, n.link, n.tags, n.share_id, n.created_at, n.updated_at, u.name as author
         from notes n
         join users u on u.id = n.user_id
         where n.share_id = $1 and n.is_public = true`,
        [shareId]
    )
    return result.rows[0]
}


module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getTags,
    setNoteShare,
    getPublicNote
}
