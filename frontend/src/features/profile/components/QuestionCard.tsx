import type { QuestionCardProps } from "../types/cardTypes"

export default function QuestionCard({ config, selectedOption, onSelect, error }: QuestionCardProps) {
    return (
        <div className="question-card">
            <h2>{config.title}</h2>
            <div>
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
                <div style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                    {error}
                </div>
            )}
        </div>
    )
}