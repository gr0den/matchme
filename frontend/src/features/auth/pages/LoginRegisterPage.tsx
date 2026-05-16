import Header from "../components/Header"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"

import './loginRegisterPage.css'

export default function LoginRegisterPage() {
    return (
        <>
            <Header />
            <main className="login-main">
                <div className="center-card">
                    <div className="toggleButtons">
                        <button>Login</button>
                        <button>Register</button>
                    </div>
                    <LoginForm />
                    <RegisterForm />
                </div>
            </main>
        </>
    )
}