import type { PictureCardProps } from "../types/cardTypes"
import "../styles/PictureCard.css"

export default function PictureCard({ onChange, onUpload, previewUrl, isUploading, error }: PictureCardProps) {
    return (
        <div className="picture-card">
            <h2>Upload your profile picture (optional)</h2>
            <div className="picture-controls">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                />
                <button
                    type="button"
                    onClick={() => void onUpload()}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload image"}
                </button>
            </div>

            {error && (
                <div className="profile-error">
                    {error}
                </div>
            )}

            {previewUrl && (
                <div className="picture-preview">
                    <img src={previewUrl} alt="Profile preview" />
                </div>
            )}
        </div>
    )
}
