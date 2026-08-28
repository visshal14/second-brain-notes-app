import backendAxios from "./backendAxios"



export const getEmbed = async (url, maxwidth) => {
    const params = { url }
    if (maxwidth) {
        params.maxwidth = maxwidth
    }


    const { data } = await backendAxios.get("/embed", { params })
    return data
}
