import bookClubIcon from "../../../shared/assets/book-icon.svg"
import "./header.css"

export default function Header() {
    return (
        <header className="login-header">
            <img src={bookClubIcon} alt="Book club icon"></img>
            <h1>Book Club</h1>
        </header>
    )
}