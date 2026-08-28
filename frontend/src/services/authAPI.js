import backendAxios from "./backendAxios"



export const registerUser = async (name, email, password) => {
    const { data } = await backendAxios.post("/auth/register", { name, email, password })
    return data
}

export const loginUser = async (email, password) => {
    const { data } = await backendAxios.post("/auth/login", { email, password })
    return data
}

export const getMe = async () => {
    const { data } = await backendAxios.get("/auth/me")
    return data
}
