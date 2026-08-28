import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./utils/ProtectedRoute"
import Navbar from "./ui/Navbar"
import Login from "./Components/Login"
import Register from "./Components/Register"
import Notes from "./Components/Notes"

import NoteEditor from "./Components/NoteEditor"
import PublicNote from "./Components/PublicNote"

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />



                <div className="page">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Notes />
                                </ProtectedRoute>
                            }
                        />



                        <Route
                            path="/notes/new"
                            element={
                                <ProtectedRoute>
                                    <NoteEditor />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/notes/:id"
                            element={
                                <ProtectedRoute>
                                    <NoteEditor />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/share/:shareId" element={<PublicNote />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    )
}
// <!-- ℑ♑︎ 亖⌽⎭🂱⎶☀️☀️⌶⍱ --> 
export default App
