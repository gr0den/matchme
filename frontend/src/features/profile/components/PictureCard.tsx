import type { PictureCardProps } from "../types/cardTypes"

export default function PictureCard({ onChange, onUpload, previewUrl, isUploading }: PictureCardProps) {
    return (
        <div className="location-card">
            <h2>Upload your profile picture (optional)</h2>
            <div>
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

            {previewUrl && (
                <div style={{ marginTop: "0.75rem" }}>
                    <img src={previewUrl} alt="Profile preview" style={{ maxWidth: "160px", borderRadius: "8px" }} />
                </div>
            )}
        </div>
    )
}