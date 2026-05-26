import { loginUser } from "../api/authApi"
import "./loginForm.css"

interface LoginFormProps {
  onError: (errorMessage: string) => void
}

export default function LoginForm({ onError }: LoginFormProps) {

  async function logIn(formData: FormData): Promise<void> {

    const email = formData.get("email")
    const password = formData.get("password")

    // required check to ensure typesafety
    if (typeof email !== "string" || typeof password !== "string") {
      console.log("value not string")
      return
    }

    try {
      const result = await loginUser({email, password})
      console.log("Logged in:", result);

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