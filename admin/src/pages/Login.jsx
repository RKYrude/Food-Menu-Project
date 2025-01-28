import "../styles/login.scss/"
import {Navigate } from 'react-router-dom';

function Login() {
    const navigate = Navigate();
    function handleLogin(){
        navigate(`${import.meta.VITE_API_URL}/auth/google/admin`);
    }

    return (
        <div className="loginPage">
            <form action="/admin">
                <h1>LOGIN <span>with</span></h1>
                <div className="gradient-border">
                    <button onClick={handleLogin}>
                        <img src="/images/google-color-icon.svg" alt="google-icon" />
                        GOOGLE
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login;