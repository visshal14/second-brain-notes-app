import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ErrorMessage from "../ui/ErrorMessage"
import apiMessage from "../utils/apiMessage"

const Login = () => {
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [busy, setBusy] = useState(false)



    if (user) {

        return <Navigate to="/" replace />
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setBusy(true)

        try {
            await login(email.trim(), password)
            navigate("/")
        } catch (err) {
            setError(apiMessage(err, "could not login"))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="card form-card">
            <h2>Login</h2>

            <form onSubmit={onSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <ErrorMessage message={error} />

                <button type="submit" disabled={busy}>
                    {busy ? "logging in..." : "Login"}
                </button>
            </form>

            <p className="muted">
                No account yet? <Link to="/register">register</Link>
            </p>
        </div>
    )
}

export default Login
