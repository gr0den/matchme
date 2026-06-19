import { registerUser } from "../api/authApi"
import "./registerForm.css"
import { useNavigate } from "react-router"
import { useAuth } from "../../../shared/context/AuthContext"

interface RegisterFormProps {
  onError: (errorMessage: string) => void
}

export default function RegisterForm({ onError }: RegisterFormProps) {
    const navigate = useNavigate();
    const { setCurrentUserId } = useAuth();

    async function register(formData: FormData): Promise<void> {
        const email = formData.get("email")
        const password = formData.get("password")
    
        if (typeof email !== "string" || typeof password !== "string") {
          console.log("value not string")
          return
        }

        try {
          const result = await registerUser({email, password})
          console.log("Registered:", result)

          setCurrentUserId(result.id) 

          navigate("/profile")

        } catch (error) {
          const message = error instanceof Error ? error.message : "Registration failed"
          onError(message)
        }
      }

    return (
        <form className="register-form" action={register}>
            <div>
              <label htmlFor="email">Email:</label>
              <input id="email" type="text" name="email"></input>
            </div>

            <div className="input-container">
              <label htmlFor="password">Password:</label>
              <input id="password" type="password" name="password"></input>
            </div>

            <button type="submit">Register</button>
        </form>
    )
}
