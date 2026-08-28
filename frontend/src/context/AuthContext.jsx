import { createContext, useContext, useEffect, useState } from "react"
import { getMe, loginUser, registerUser } from "../services/authAPI"

const AuthContext = createContext(null)

const TOKEN_KEY = "accessToken"


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)



    useEffect(() => {
        const token = window.localStorage.getItem(TOKEN_KEY)
        if (!token) {
            setLoading(false)

            return;
        }

        getMe()
            .then((me) => setUser(me))
            .catch(() => {

                window.localStorage.removeItem(TOKEN_KEY)
            })
            .finally(() => setLoading(false))
    }, [])

    const saveSession = (data) => {
        window.localStorage.setItem(TOKEN_KEY, data.token)
        setUser(data.user)
        return data.user
    }

    const login = async (email, password) => saveSession(await loginUser(email, password))



    const register = async (name, email, password) => saveSession(await registerUser(name, email, password))

    const logout = () => {
        window.localStorage.removeItem(TOKEN_KEY)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 

export const useAuth = () => useContext(AuthContext)
