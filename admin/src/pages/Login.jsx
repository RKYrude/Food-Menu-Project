import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/login.scss/";

function Login(props) {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(false);
    // cos

    let message;
    if (error) {
        message = (
            <p
                className="loginError"
                style={{
                    backgroundColor: "rgb(255, 228, 235)",
                    border: "3px solid rgb(241, 26, 73)",
                    color: "red"
                }}
            >
                {error}
            </p>
        );
    }

    useEffect(() => {
        if (searchParams.has("error")) {
            setError('User Not Found! Try other Gmail account.');
        }else if (props.err){
            setError(props.err);
        }

        setTimeout(()=>{
            setError(false)
        }, 5000);;
    }, [searchParams]);

    async function handleLogin(e) {
        e.preventDefault();
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }

    return (
        <div className="loginPage">
            <section >
                <h1>LOGIN <span>with</span></h1>
                <div className="gradient-border">
                    <button onClick={handleLogin}>
                        <img src="/images/google-color-icon.svg" alt="google-icon" />
                        GOOGLE
                    </button>
                </div>
            </section>

            {message}
        </div>
    )
}

export default Login;