import type { QuestionCardProps } from "../types/cardTypes"
import "../styles/QuestionCard.css"

export default function QuestionCard({ config, selectedOption, onSelect, error }: QuestionCardProps) {
    return (
        <div className="question-card">
            <h2>{config.title}</h2>
            <div className="question-options">
                {config.options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onSelect(option.id)}
                        className={selectedOption === option.id ? "selected" : ""}
                    >
                        {option.label}
                    </button>
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
