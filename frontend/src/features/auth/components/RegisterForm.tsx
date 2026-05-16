export default function RegisterForm() {
    return (
        <form>
            <div>
                <label htmlFor="userName">UserName:</label>
                <input id="userName" type="text" name="userName"></input>
            </div>

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