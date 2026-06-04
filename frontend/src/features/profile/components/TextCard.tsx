import type { TextCardProps } from "../types/cardTypes"

export default function TextCard({ config, value, onChange}: TextCardProps) {
    return (
        <div className="text-card">
            <h2>{config.title}</h2>

            {config.type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={(event) => onChange(config.id, event.target.value)}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(config.id, event.target.value)}
                />
            )}
        </div>
    )
}

