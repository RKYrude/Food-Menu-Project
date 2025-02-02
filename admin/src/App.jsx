import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Additem from './pages/Additem';
import Edititem from './pages/Edititem';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Authenticationloader from './components/Authenticationloader';


function App() {

    const [user, setUser] = useState(null);

    const [error, setError] = useState(false);

    async function checkLogin() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/login`, { withCredentials: true });            

            setUser(response.data.user ? response.data.user : false);

        } catch (err) {
            console.log(err.response.data.message);
            setError(err.response.data.message);
            setUser(false);
        }
    }
    useEffect(() => {
        checkLogin();
    }, []);

    if (user != null) {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login err={error}/>} />
                    <Route path="/admin" element={user ? <Admin user={user}/> : <Navigate to="/login" />} />
                    <Route path="/additem" element={user ? <Additem /> : <Navigate to="/login" />} />
                    <Route path="/edititem" element={user ? <Edititem /> : <Navigate to="/login" />} />
                </Routes>
            </Router>
        );
    } else {
        return (
            <Authenticationloader />
        )
    }
}

export default App;