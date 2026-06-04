import type { ButtonCardProps } from "../types/cardTypes"

export default function ButtonCard({title, names, selectedNames, onToggle}: ButtonCardProps) {
    return (
        <div className="card">
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
        </div>
    )
}