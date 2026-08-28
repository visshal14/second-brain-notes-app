import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "../ui/Loading"


const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <Loading text="checking your session..." />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default ProtectedRoute
