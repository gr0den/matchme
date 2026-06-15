import type { TextCardProps } from "../types/cardTypes"

export default function TextCard({ config, value, onChange, error }: TextCardProps) {
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

            {error && (
                <div style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                    {error}
                </div>
            )}
        </div>
    )
}

