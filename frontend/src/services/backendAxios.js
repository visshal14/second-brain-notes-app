import axios from "axios"

const backendAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})


backendAxios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("accessToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default backendAxios
