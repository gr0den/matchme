import type { LocationCardProps } from "../types/cardTypes"

export default function LocationCard({ onClick }: LocationCardProps) {
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
        </div>
    )
}