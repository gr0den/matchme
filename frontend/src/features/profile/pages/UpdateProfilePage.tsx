// Profile update component
// Allows users to modify their profile information in a single form

import { useUserProfile } from "../hooks/useUserProfile";
import { useEffect, useState } from "react";
import type { EditProfileForm, Interest, Genre } from "../types/cardTypes"
import { getMe, getBio, getProfile } from "../api/profileApi";

export default function UpdateProfilePage() {
//    const {
//        userProfile,
//        interestsOptions,
//        genresOptions,
//        isLoadingTags,
//        tagsError,
//        handleChange,
//        toggleButtonNames,
//        handleBranchChoice,
//        getUserCoords,
//        getSearchRadius,
//        handleImageChange,
//        handleImageUpload,
//        imageError,
//        previewUrl,
//        isUploadingImage,
//    } = useUserProfile()
//
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
                    targetGenres: bio.genres,
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

    // before this use useEffect to populate formData
    function updateProfile() {
        // validates
        // loads data to userProfile // prompts with error(s)
        // call update api
    }

    function createInterestCheckboxes(items: Interest[]) {
        return items.map((item) => (
            <label key={item.id}>
                {item.interest}
                <input type="checkbox" />
            </label>
        ))
    }

    function createGenreCheckboxes(items: Genre[]) {
        return items.map((item) => (
            <label key={item.id}>
                {item.genre}
                <input type="checkbox" />
            </label>
        ))
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
            <form action={updateProfile}>

                <div className="username">
                    <label>Username:
                        <input type="text" name="userName"/>
                    </label>
                </div>

                <div className="bio">
                    <label>Bio:
                        <textarea name="bio"></textarea>
                    </label>
                </div>

                <div className="interests">
                    {createInterestCheckboxes(formData.interests)}
                </div>

                <div className="genres">
                    {createGenreCheckboxes(formData.genres)}
                </div>

                <div className="targetGenres">
                    {createGenreCheckboxes(formData.targetGenres)}
                </div>

                <div className="location">
                    <label>Latitude:
                        <input type="text" name="latitude"/>
                    </label>

                    <label>Longitude:
                        <input type="text" name="longitude"/>
                    </label>
                </div>

                <div className="pictureUrl">
                    <label>Picture:
                        <input type="text" name="pictureUrl"/>
                    </label>
                </div>

                <div className="searchRadius">
                    <label>Search radius:
                        <input type="text" name="searchRadius"/>
                    </label>
                </div>

                <button>Save</button>
            </form>
        </div>
    )
}
