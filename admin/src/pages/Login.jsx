import "../styles/login.scss/"

function Login() {
    return (
        <div className="loginPage">
            <form action="/admin">
                <h1>LOGIN <span>with</span></h1>
                <div className="gradient-border">
                    <button>
                        <img src="/images/google-color-icon.svg" alt="google-icon" />
                        GOOGLE
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login;