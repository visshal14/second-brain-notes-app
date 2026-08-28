import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ErrorMessage from "../ui/ErrorMessage"
import apiMessage from "../utils/apiMessage"

const Register = () => {
    const { user, register } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState("")
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


        if (password.length < 6) {
            return setError("password must be at least 6 characters")
        }

        setBusy(true)
        try {


            await register(name.trim(), email.trim(), password)
            navigate("/")
        } catch (err) {
            setError(apiMessage(err, "could not register"))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="card form-card">
            <h2>Register</h2>

            <form onSubmit={onSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

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
                    {busy ? "creating..." : "Create account"}
                </button>
            </form>

            <p className="muted">
                Already have an account? <Link to="/login">login</Link>
            </p>
        </div>
    )
}

export default Register
