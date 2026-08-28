

const apiMessage = (err, fallback) => {
    if (err.response && err.response.data && err.response.data.message) {
        return err.response.data.message
    }
    if (err.code === "ERR_NETWORK") {
        return "cannot reach the server, is the backend running?"
    }
    return fallback
}

export default apiMessage
