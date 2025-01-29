import "../styles/login.scss/"
import { useEffect } from "react";
import axios from "axios"

function Login() {
    function handleLogin() {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/admin`;
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/auth/login/success`, {
            withCredentials: true, // 🔥 Allows cookies to be sent
        })
            .then(response => {
                setUser(response.data.user); // Set user if authenticated
            })
            .catch(error => {
                console.error("Error fetching login status:", error);
            });
    }, []);

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