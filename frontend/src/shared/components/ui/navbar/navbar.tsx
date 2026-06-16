import { logout } from "../../../../features/auth/api/authApi"

export default function NavBar() {
    return (
        <nav>
            <ul>
                <li>
                    <button onClick={logout}>Log out</button>
                </li>
            </ul>
        </nav>
    )
}