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

  async function getUser() {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/login/success`, { withCredentials: true });
      setUser(data.user.json);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(()=> {
    getUser();
  },[]);

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

export default App;
