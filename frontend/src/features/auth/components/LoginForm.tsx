import { loginUser } from "../api/authApi"
import "./loginForm.css"
import { useNavigate } from "react-router"
// 1. IMPORT THE AUTH CONTEXT
import { useAuth } from "../../../shared/context/AuthContext"

interface LoginFormProps {
  onError: (errorMessage: string) => void
}

export default function LoginForm({ onError }: LoginFormProps) {
  const navigate = useNavigate();
  // 2. EXTRACT THE SETTER FUNCTION
  const { setCurrentUserId } = useAuth();

  async function logIn(formData: FormData): Promise<void> {

    const email = formData.get("email")
    const password = formData.get("password")

    if (typeof email !== "string" || typeof password !== "string") {
      console.log("value not string")
      return
    }

    try {
      const result = await loginUser({email, password})
      console.log("Logged in:", result);

      // 3. TRIGGER THE WEBSOCKET
      // Assuming your backend returns the ID inside 'result' (e.g., result.id or result.userId).
      // Update 'result.id' to match whatever your Java backend actually returns in the JSON.
      setCurrentUserId(result.id); 

      navigate("/profile")

    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
        console.log("message inside of LoginForm: " + message)
        onError(message)
    }
  }

    return (
        <form className="login-form" action={logIn}>
            <div>
              <label htmlFor="email">Email:</label>
              <input id="email" type="text" name="email"></input>
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input id="password" type="password" name="password"></input>
            </div>

            <button>Log in</button>
        </form>
    )
}