export default function LoginForm() {
    return (
        <form>
            <div>
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" name="email"></input>
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input id="password" type="password" name="password"></input>
            </div>

            <button>Log in</button>
        </form>
    )
}