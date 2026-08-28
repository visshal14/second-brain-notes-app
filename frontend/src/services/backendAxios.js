import axios from "axios"

const backendAxios = axios.create({
    baseURL: "https://second-brain-notes-app.onrender.com/api"
})


backendAxios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("accessToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default backendAxios
