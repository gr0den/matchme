import { useLocation, useNavigate } from "react-router-dom"
import { useOutletContext } from "react-router-dom"
import type { RootOutletContext } from "../../../../app/RootLayout"
import { logout } from "../../../../features/auth/api/authApi"
import "./navbar.css"

export default function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { unreadChatCount } = useOutletContext<RootOutletContext>()

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.error("Failed to log out.", error)
        }
    }

    function getNavButtonClass(path: string) {
        return location.pathname === path ? "navbar-button active" : "navbar-button"
    }

    return (
        <nav className="navbar" aria-label="Main navigation">
            <ul className="navbar-list navbar-list-left">
                <li>
                    <button
                        type="button"
                        className={getNavButtonClass("/profile")}
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={getNavButtonClass("/recommendations")}
                        onClick={() => navigate("/recommendations")}
                    >
                        Match
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={getNavButtonClass("/connections")}
                        onClick={() => navigate("/connections")}
                    >
                        Connections
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={getNavButtonClass("/chat")}
                        onClick={() => navigate("/chat")}
                    >
                        <span className="navbar-chat-label">Chat</span>
                        {unreadChatCount > 0 && (
                            <span className="navbar-chat-badge" aria-label={`${unreadChatCount} unread chat messages`}>
                                {unreadChatCount > 99 ? "99+" : unreadChatCount}
                            </span>
                        )}
                    </button>
                </li>
            </ul>

            <ul className="navbar-list navbar-list-right">
                <li>
                    <button
                        type="button"
                        className="navbar-button navbar-logout-button"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </li>
            </ul>
        </nav>
    )
}
