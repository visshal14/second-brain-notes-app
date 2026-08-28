import backendAxios from "./backendAxios"



export const getPublicNote = async (shareId) => {
    const { data } = await backendAxios.get("/public/" + shareId)
    return data
}
