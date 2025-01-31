import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Additem from './pages/Additem';
import Edititem from './pages/Edititem';
import { useState, useEffect } from 'react';
import axios from 'axios';


function App() {

    const [user, setUser] = useState(null);

    async function checkLogin() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/login`, { withCredentials: true });

            if (response.data.user) {
                console.log("use found");
                
                setUser(true)
            }else{
                console.log("user NOT found");
                
                setUser(false);
            }
        } catch (err) {
            console.log(err);
            setUser(false);
        }
    }
    useEffect(() => {
        checkLogin();
    }, [])

    if (user != null) {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />} />
                    <Route path="/additem" element={user ? <Additem /> : <Navigate to="/login" />} />
                    <Route path="/edititem" element={user ? <Edititem /> : <Navigate to="/login" />} />
                </Routes>
            </Router>
        );
    }
}

export default App;