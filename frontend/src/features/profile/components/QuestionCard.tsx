import type { QuestionCardProps } from "../types/cardTypes"

export default function QuestionCard({ config, selectedOption, onSelect }: QuestionCardProps) {
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
        </div>
    )
}