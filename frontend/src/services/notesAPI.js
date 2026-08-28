import backendAxios from "./backendAxios"

export const listNotes = async ({ search, tag } = {}) => {
    const params = {}
    if (search) {
        params.search = search
    }
    if (tag) {
        params.tag = tag
    }

    const { data } = await backendAxios.get("/notes", { params })
    return data
}



export const getNote = async (id) => {

    const { data } = await backendAxios.get("/notes/" + id)
    return data
}

export const createNote = async (note) => {
    const { data } = await backendAxios.post("/notes", note)
    return data


}

export const updateNote = async (id, note) => {

    const { data } = await backendAxios.put("/notes/" + id, note)
    return data

}

export const deleteNote = async (id) => {

    const { data } = await backendAxios.delete("/notes/" + id)

    return data
}

export const listTags = async () => {

    const { data } = await backendAxios.get("/tags")
    return data
}

export const toggleShare = async (id, isPublic) => {
    const { data } = await backendAxios.put("/notes/" + id + "/share", { is_public: isPublic })

    return data
}

// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 