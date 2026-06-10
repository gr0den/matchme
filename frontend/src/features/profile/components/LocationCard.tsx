import type { LocationCardProps } from "../types/cardTypes"

export default function LocationCard({ onClick, onChange }: LocationCardProps) {
    return (
        <div className="location-card">
            <h2>Where are you located?</h2>
            <div>
                <button
                    onClick={() => onClick()}
                >
                    Find my location
                </button>
            </div>

            <div>
                <input 
                    type="text"
                    id="radius"
                    name="radius"
                    placeholder="30"
                    onChange={(event) => onChange(event)}
                />
                <label htmlFor="radius">Search Radius 1 - 20 000km</label>
            </div>
        </div>
    )
}