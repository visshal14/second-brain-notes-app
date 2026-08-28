import backendAxios from "./backendAxios"


export const askNotes = async (question) => {
    const { data } = await backendAxios.post("/ask", { question })
    return data
}
