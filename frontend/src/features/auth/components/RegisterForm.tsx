import { registerUser } from "../api/authApi"

export default function RegisterForm() {

    async function register(formData: FormData): Promise<void> {
        const email = formData.get("email")
        const password = formData.get("password")
    
        if (typeof email !== "string" || typeof password !== "string") {
          console.log("value not string")
          return
        }
        console.log(email, password)
        // call api and receive answer
        try {
          const result = await registerUser({email, password})
    
          console.log("Logged in:", result);
          // navigate("/profile") later
    
        } catch (error) {
          console.error("Login failed", error);
        }
      }

    return (
        <form action={register}>
            <div>
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" name="email"></input>
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input id="password" type="password" name="password"></input>
            </div>

            <button>Register</button>
        </form>
    )
}