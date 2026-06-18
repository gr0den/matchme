import type { ButtonCardProps } from "../types/cardTypes"
import "../styles/ButtonCard.css"

export default function ButtonCard({ title, names, selectedNames, onToggle, error }: ButtonCardProps) {
    return (
        <div className="button-card">
            <h2>{title}</h2>

            <div className="button-container">
                {names.map((item) => (
                    <button
                    key={item.id}
                    type="button"
                    className={selectedNames.includes(item.id) ? "selected" : ""}
                    onClick={() => onToggle(item.id)}
                    >{item.name}</button>
                ))}
            </div>

            {error && (
                <div className="profile-error">
                    {error}
                </div>
            )}
        </div>
    )
}
