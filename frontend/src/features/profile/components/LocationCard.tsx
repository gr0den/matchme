import type { LocationCardProps } from "../types/cardTypes"
import "../styles/LocationCard.css"

export default function LocationCard({
    onClick,
    onChange,
    isGettingLocation = false,
    locationMessage,
    error,
}: LocationCardProps) {
    const buttonLabel = isGettingLocation
        ? "Loading..."
        : locationMessage?.type === "error"
          ? "Try again"
          : "Find my location"

    return (
        <div className="location-card">
            <h2>Where are you located?</h2>
            <div className="location-actions">
                <button
                    onClick={() => onClick()}
                    disabled={isGettingLocation}
                >
                    {buttonLabel}
                </button>
                {locationMessage && (
                    <p
                        className={`location-message ${locationMessage.type}`}
                        role={locationMessage.type === "error" ? "alert" : "status"}
                    >
                        {locationMessage.text}
                    </p>
                )}
            </div>

            <div className="location-radius">
                <input 
                    type="text"
                    id="radius"
                    name="radius"
                    placeholder="8000"
                    onChange={(event) => onChange(event)}
                />
                <label htmlFor="radius">Search Radius 1 - 20 000km</label>
            </div>

            {error && (
                <div className="profile-error">
                    {error}
                </div>
            )}
        </div>
    )
}
