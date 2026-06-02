import { useState } from "react"

import Header from "../components/Header"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"

import './loginRegisterPage.css'

export default function LoginRegisterPage() {
    const [displayLogReg, setDisplayLogReg] = useState(true)
    const [displayError, setDisplayError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    function displayLogin(): void {
        setDisplayLogReg(() => true)
    }
    function displayRegister(): void {
        setDisplayLogReg(() => false)
    }

    function displayErrorBar(errorMessage: string): void {
        setDisplayError(() => true)
        setErrorMessage(errorMessage)
    }

    return (
        <>
            <Header />
            <main className="login-main">
                <div className="toggleButtons">
                        <button 
                        className={`loginBtn ${displayLogReg ? "active" : ""}`}
                        onClick={displayLogin}>Login
                        </button>

                        <button 
                        className={`regBtn ${displayLogReg ? "" : "active"}`} 
                        onClick={displayRegister}>Register
                        </button>
                </div>
                <div className="center-card">
                    {displayLogReg === true ? 
                    <LoginForm onError={displayErrorBar} /> : 
                    <RegisterForm onError={displayErrorBar} />}
                </div>
                <div className="error-bar">
                    {displayError && <p>{errorMessage}</p>}
                </div>
            </main>
        </>
    )
}