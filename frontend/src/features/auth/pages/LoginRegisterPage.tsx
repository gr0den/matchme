import { useState } from "react"

import Header from "../components/Header"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"

import './loginRegisterPage.css'

export default function LoginRegisterPage() {
    const [displayLogReg, setDisplayLogReg] = useState(true)

    function displayLogin(): void {
        setDisplayLogReg(() => true)
    }
    function displayRegister(): void {
        setDisplayLogReg(() => false)
    }

    return (
        <>
            <Header />
            <main className="login-main">
                <div className="center-card">
                    <div className="toggleButtons">
                        <button onClick={displayLogin}>Login</button>
                        <button onClick={displayRegister}>Register</button>
                    </div>
                    {displayLogReg === true ? <LoginForm /> : <RegisterForm />}
                    
                </div>
            </main>
        </>
    )
}