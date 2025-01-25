import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Additem from './pages/Additem';
import Edititem from './pages/Edititem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/additem" element={<Additem />} />
        <Route path="/edititem" element={<Edititem />} />
      </Routes>
    </Router>
  );
}

export default App;
