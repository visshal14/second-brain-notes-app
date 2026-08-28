import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const onLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <nav className="nav">
            <div className="nav-inner">
                <Link to="/" className="brand">Second Brain</Link>



                <div className="nav-links">
                    {user ? (
                        <>


                            <Link to="/">notes</Link>
                            <Link to="/ask">ask</Link>
                            <span className="muted">{user.name}</span>
                            <button className="btn-plain" onClick={onLogout}>logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">login</Link>

                            <Link to="/register">register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default Navbar
