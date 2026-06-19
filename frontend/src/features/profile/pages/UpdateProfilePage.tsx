// Profile update component
// Allows users to modify their profile information in a single form

import { useUserProfile } from "../hooks/useUserProfile";
import { useEffect, useState } from "react";
import type { EditProfileForm, Interest, Genre, ButtonData, UserProfileCreation } from "../types/cardTypes"
import { useFieldErrors } from "../errorHandling/useFieldErrors";
import { getMe, getBio, getProfile, updateProfile as updateProfileApi } from "../api/profileApi";
import defaultAvatar from "../../../shared/assets/default-avatar.png"
import "../styles/UpdateProfilePage.css"

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
    const [isGettingLocation, setIsGettingLocation] = useState(false)
    const [locationMessage, setLocationMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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
                <label className="profile-checkbox" key={option.id}>
                    <input
                        type="checkbox"
                        name="interests"
                        value={option.id}
                        checked={isChecked}
                        onChange={(event) => toggleInterest(option, event.target.checked)}
                    />
                    {option.name}
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
                <label className="profile-checkbox" key={option.id}>
                    <input
                        type="checkbox"
                        name={field}
                        value={option.id}
                        checked={isChecked}
                        onChange={(event) =>
                            toggleGenre(field, option, event.target.checked)
                        }
                    />
                    {option.name}
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
        clearFieldError("location")
        setLocationMessage(null)

        if (!navigator.geolocation) {
            setLocationMessage({
                type: "error",
                text: "Geolocation is not supported by your browser.",
            })
            return
        }

        setIsGettingLocation(true)

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
                setLocationMessage({
                    type: "success",
                    text: "Location updated.",
                })
                setIsGettingLocation(false)
            },
            (error) => {
                console.error(`Unable to get user location with error code: ${error.code}`)
                setLocationMessage({
                    type: "error",
                    text: "Unable to get your location. Please allow location access and try again.",
                })
                setIsGettingLocation(false)
            }
        )
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
            <pre className="profile-debug">
                {JSON.stringify(formData, null, 2)}
            </pre>
        )
    }

    if (isLoading) {
        return <p className="profile-status">Loading...</p>
    }

    if (error) {
        return <p className="profile-status profile-error">{error}</p>
    }

    if (!formData) {
        return null
    }

    return (

        <div className="update-profile-page">
            <form className="update-profile-form" onSubmit={updateProfile}>

                <div className="profile-field username">
                    <label>Username
                        <input type="text" name="userName" value={formData.userName} 
                            onChange={(e) => {
                                setFormData(prev => prev ? {...prev, userName: e.target.value} : prev)
                                clearFieldError("userName")
                            }}
                        />
                        {fieldErrors.userName && <p className="profile-error" role="alert">{fieldErrors.userName}</p>}
                    </label>
                </div>

                <div className="profile-field bio">
                    <label>Bio
                        <textarea name="bio" value={formData.bio} 
                            onChange={(e) => {
                                setFormData(prev => prev ? {...prev, bio: e.target.value} : prev)
                                clearFieldError("bio")
                            }}
                        />
                        {fieldErrors.bio && <p className="profile-error" role="alert">{fieldErrors.bio}</p>}
                    </label>
                </div>

                <div className="profile-field interests">
                    <p>My Interests:</p>
                    <div className="profile-checkbox-group">
                        {createInterestCheckboxes(interestsOptions, formData.interests)}
                    </div>
                    {fieldErrors.interests && <p className="profile-error" role="alert">{fieldErrors.interests}</p>}
                </div>

                <div className="profile-field genres">
                    <p>My Genres:</p>
                    <div className="profile-checkbox-group">
                        {createGenreCheckboxes(genresOptions, formData.genres, "genres")}
                    </div>
                    {fieldErrors.genres && <p className="profile-error" role="alert">{fieldErrors.genres}</p>}
                </div>

                <div className="profile-field targetGenres">
                    <p>Target Genres:</p>
                    <div className="profile-checkbox-group">
                        {createGenreCheckboxes(genresOptions, formData.targetGenres, "targetGenres")}
                    </div>
                    {fieldErrors.targetGenres && <p className="profile-error" role="alert">{fieldErrors.targetGenres}</p>}
                </div>

                <div className="profile-field location">
                    <button
                        type="button"
                        onClick={getNewUserCoords}
                        disabled={isGettingLocation}
                    >
                        {isGettingLocation ? "Loading..." : "Update current location"}
                    </button>
                    {locationMessage && (
                        <p
                            className={`profile-location-message ${locationMessage.type}`}
                            role={locationMessage.type === "error" ? "alert" : "status"}
                        >
                            {locationMessage.text}
                        </p>
                    )}
                    {fieldErrors.location && <p className="profile-error" role="alert">{fieldErrors.location}</p>}
                </div>

                <div className="profile-field pictureUrl">
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
                        <p className="profile-error">{imageError}</p>
                    )}
                    <img
                        className="profile-preview-image"
                        src={(previewUrl ?? formData.pictureUrl) || defaultAvatar}
                        alt="Profile preview"
                    />
                </div>

                <div className="profile-field searchRadius">
                    <label>Search radius
                        <input type="text" name="searchRadius" value={formData.searchRadius}
                            onChange={(e) => {
                                setFormData(prev => prev ? {...prev, searchRadius: Number(e.target.value)} : prev)
                                clearFieldError("location")
                        }}
                        />
                        {fieldErrors.location && <p className="profile-error" role="alert">{fieldErrors.location}</p>}
                    </label>
                </div>

                <button type="submit">Save</button>
            </form>

            {renderUserObject()}
        </div>
    )
}
