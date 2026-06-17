// Profile update component
// Allows users to modify their profile information in a single form

import { useUserProfile } from "../hooks/useUserProfile";
import { useEffect, useState } from "react";
import type { EditProfileForm, Interest, Genre, ButtonData, UserProfileCreation } from "../types/cardTypes"
import { useFieldErrors } from "../errorHandling/useFieldErrors";
import { getMe, getBio, getProfile, updateProfile as updateProfileApi } from "../api/profileApi";

export default function UpdateProfilePage() {
    const {
        interestsOptions,
        genresOptions,
        handleImageChange,
        handleImageUpload,
        imageError,
        previewUrl,
        isUploadingImage,
    } = useUserProfile()

    const {
        fieldErrors,
        validateCard,
        clearFieldError,
        clearAllErrors,
    } = useFieldErrors();

    const [formData, setFormData] = useState<EditProfileForm | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true)

                const [me, profile, bio] = await Promise.all([
                    getMe(),
                    getProfile(),
                    getBio(),
                ])

                // mapping
                setFormData({
                    userId: bio.id,
                    longitude: bio.longitude,
                    latitude: bio.latitude,
                    searchRadius: bio.searchRadius,
                    interests: bio.interests,
                    genres: bio.genres,
                    targetGenres: bio.targetGenres,
                    bio: profile.bio,
                    userName: me.userName,
                    pictureUrl: me.pictureUrl,
                })
            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to load profile.")
            } finally {
                setIsLoading(false)
            }
        }

        loadProfile()
    }, [])

    function buildProfilePayload(formData: EditProfileForm): UserProfileCreation {
        return {
            userName: formData.userName,
            bio: formData.bio,
            interests: formData.interests.map((interest) => interest.id),
            genres: formData.genres.map((genre) => genre.id),
            targetGenres: formData.targetGenres.map((genre) => genre.id),
            latitude: formData.latitude,
            longitude: formData.longitude,
            searchRadius: formData.searchRadius,
            ...(formData.pictureUrl ? { pictureUrl: formData.pictureUrl } : {}),
        }
    }

    async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!formData) return

        clearAllErrors()

        const profilePayload = buildProfilePayload(formData)

        const validationErrors = [
            validateCard("userName", profilePayload),
            validateCard("bio", profilePayload),
            validateCard("interests", profilePayload),
            validateCard("genres", profilePayload),
            validateCard("targetGenres", profilePayload),
            validateCard("location", profilePayload),
        ]

        const hasErrors = validationErrors.some((error) => error !== null)

        if (hasErrors) return

        try {
            await updateProfileApi(profilePayload)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update profile.")
        }
    }

    function createInterestCheckboxes(options: ButtonData[], selectedInterests: Interest[]) {
        return options.map((option) => {
            const isChecked = selectedInterests.some((interest) => interest.id === option.id)

            return (
                <label key={option.id}>
                {option.name}
                <input
                    type="checkbox"
                    name="interests"
                    value={option.id}
                    checked={isChecked}
                    onChange={(event) => toggleInterest(option, event.target.checked)}
                />
            </label>
            )
        })
    }

    function toggleInterest(option: ButtonData, checked: boolean) {
        clearFieldError("interests")

        setFormData((prev) => {
            if (!prev) {
                return prev
            }

            return {
                ...prev,
                interests: checked
                    ? [...prev.interests, { id: option.id, interest: option.name }]
                    : prev.interests.filter((interest) => interest.id !== option.id),
            }
        })
    }

    function createGenreCheckboxes(options: ButtonData[], selectedGenres: Genre[], field: "genres" | "targetGenres") {
        return options.map((option) => {
            const isChecked = selectedGenres.some((genre) => genre.id === option.id)

            return (
                <label key={option.id}>
                {option.name}
                <input
                    type="checkbox"
                    name={field}
                    value={option.id}
                    checked={isChecked}
                    onChange={(event) =>
                        toggleGenre(field, option, event.target.checked)
                    }
                />
            </label>
            )
        })
    }

    function toggleGenre(field: "genres" | "targetGenres", option: ButtonData, checked: boolean) {
        clearFieldError(field)

        setFormData((prev) => {
            if (!prev) {
                return prev
            }

            return {
                ...prev,
                [field]: checked
                    ? [...prev[field], { id: option.id, genre: option.name }]
                    : prev[field].filter((genre) => genre.id !== option.id),
            }
        })
    }

    function getNewUserCoords() {
        clearFieldError("location");

        if (!navigator.geolocation) {
            console.error("Geolocation is not supported.");
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => prev
                        ? {
                            ...prev,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                          }
                        : prev
                    )
                },
                (error) => {console.error(`Unable to get user location with error code: ${error.code}`)}
            )
        }
    }

    async function handleNewImageUpload() {
        const uploadedUrl = await handleImageUpload()

        if (!uploadedUrl) {
            return
        }

        setFormData(prev => prev
            ? {
                ...prev,
                pictureUrl: uploadedUrl,
              }
            : prev
        )
    }

    function renderUserObject() {
        return (
            <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(formData, null, 2)}
            </pre>
        )
    }

    if (isLoading) {
    return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    if (!formData) {
        return null
    }

    return (

        <div>
            <form onSubmit={updateProfile}>

                <div className="username">
                    <label>Username:
                        <input type="text" name="userName" value={formData.userName} 
                            onChange={(e) => {
                                setFormData(prev => prev ? {...prev, userName: e.target.value} : prev)
                                clearFieldError("userName")
                            }}
                        />
                        {fieldErrors.userName && <p role="alert" style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>{fieldErrors.userName}</p>}
                    </label>
                </div>

                <br></br>

                <div className="bio">
                    <label>Bio:
                        <textarea name="bio" value={formData.bio} 
                            onChange={(e) => {
                                setFormData(prev => prev ? {...prev, bio: e.target.value} : prev)
                                clearFieldError("bio")
                            }}
                        />
                        {fieldErrors.bio && <p role="alert" style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>{fieldErrors.bio}</p>}
                    </label>
                </div>

                <br></br>

                <div className="interests">
                    <p>My Interests:</p>
                    {createInterestCheckboxes(interestsOptions, formData.interests)}
                    {fieldErrors.interests && <p role="alert" style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>{fieldErrors.interests}</p>}
                </div>

                <br></br>

                <div className="genres">
                    <p>My Genres:</p>
                    {createGenreCheckboxes(genresOptions, formData.genres, "genres")}
                    {fieldErrors.genres && <p role="alert" style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>{fieldErrors.genres}</p>}
                </div>

                <br></br>

                <div className="targetGenres">
                    <p>Target Genres:</p>
                    {createGenreCheckboxes(genresOptions, formData.targetGenres, "targetGenres")}
                    {fieldErrors.targetGenres && <p role="alert" style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>{fieldErrors.targetGenres}</p>}
                </div>

                <br></br>

                <div className="location">
                    <p>Latitude: {formData.latitude}</p>

                    <br></br>

                    <p>Longitude: {formData.longitude}</p>
                    <button type="button" onClick={getNewUserCoords}>Use current location</button>
                    {fieldErrors.location && <p role="alert" style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>{fieldErrors.location}</p>}
                </div>

                <br></br>

                <div className="pictureUrl">
                     <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        onClick={handleNewImageUpload}
                        disabled={isUploadingImage}
                    >
                        {isUploadingImage ? "Uploading..." : "Upload image"}
                    </button>
                    {imageError && (
                        <p>{imageError}</p>
                    )}
                    {(previewUrl ?? formData.pictureUrl) && (
                        <img src={previewUrl ?? formData.pictureUrl} alt="Profile preview" style={{ maxWidth: "160px", borderRadius: "8px" }}/>
                    )}
                </div>

                <br></br>

                <div className="searchRadius">
                    <label>Search radius:
                        <input type="text" name="searchRadius" value={formData.searchRadius}
                            onChange={(e) => {
                                setFormData(prev => prev ? {...prev, searchRadius: Number(e.target.value)} : prev)
                                clearFieldError("location")
                        }}
                        />
                        {fieldErrors.location && <p role="alert" style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>{fieldErrors.location}</p>}
                    </label>
                </div>

                <br></br>

                <button>Save</button>
            </form>

            <div>{renderUserObject()}</div>
        </div>
    )
}
