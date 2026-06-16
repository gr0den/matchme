import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { fetchGenres, fetchInterests, uploadProfileImage, createProfile } from "../api/profileApi";
import type { ButtonData, UserProfile, UserProfileCreation } from "../types/cardTypes";
import { useFieldErrors } from "../errorHandling/useFieldErrors";



export function useUserProfile() {
    const [userProfile, setUserProfile] = useState<UserProfile>({})
    const [interestsOptions, setInterestsOptions] = useState<ButtonData[]>([])
    const [genresOptions, setGenresOptions] = useState<ButtonData[]>([])
    const [isLoadingTags, setIsLoadingTags] = useState(true)
    const [tagsError, setTagsError] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const { fieldErrors, validateCard, clearFieldError, clearAllErrors } = useFieldErrors()

    useEffect(() => {
        let isMounted = true

        async function loadTagOptions() {
            setIsLoadingTags(true)
            setTagsError(null)

            try {
                const [interests, genres] = await Promise.all([
                    fetchInterests(),
                    fetchGenres(),
                ])

                if (!isMounted) {
                    return
                }

                setInterestsOptions(interests)
                setGenresOptions(genres)
            } catch (error) {
                if (!isMounted) {
                    return
                }

                setTagsError(error instanceof Error ? error.message : "Failed to load profile tags.")
            } finally {
                if (isMounted) {
                    setIsLoadingTags(false)
                }
            }
        }

        loadTagOptions()

        return () => {
            isMounted = false
        }
    }, [])

    function handleChange(id: string, value: string) {
        setUserProfile(prev => ({
            ...prev,
            [id]: value,
        }))
    }

    function toggleButtonNames(field: "interests" | "genres" | "targetGenres", value: number) {
        setUserProfile(prev => {
            const selectedNames = prev[field] ?? []

            return {
                ...prev,
                [field]: selectedNames.includes(value)
                    ? selectedNames.filter(item => item !== value)
                    : [...selectedNames, value],
            }
        })
    }

    function handleBranchChoice(value: "same" | "different") {
        setUserProfile(prev => ({
            ...prev,
            branchChoice: value,
        }))
    }

    function getUserCoords() {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported.");
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserProfile(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }))
                },
                (error) => {console.error(`Unable to get user location with error code: ${error.code}`)}
            )
        }
    }

    function getSearchRadius(event: ChangeEvent<HTMLInputElement>) {
        const radius: number = Number(event.target.value)

        setUserProfile(prev => ({
            ...prev,
            searchRadius: radius,
        }))
    }

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null

        setImageFile(file)
        setImageError(null)
    }

    async function handleImageUpload() {
        if (!imageFile) {
            setImageError("Choose an image before uploading.")
            return
        }

        setIsUploadingImage(true)
        setImageError(null)

        try {
            const uploadedUrl = await uploadProfileImage(imageFile)

            setPreviewUrl(uploadedUrl)
            setUserProfile(prev => ({
                ...prev,
                pictureUrl: uploadedUrl,
            }))
        } catch (error) {
            setImageError(error instanceof Error ? error.message : "Image upload failed.")
        } finally {
            setIsUploadingImage(false)
        }
    }

    async function submitUserProfile() {
        const finalProfile = buildUserProfileCreation(userProfile)

        if (!finalProfile) {
            return
        }

        const result = await createProfile(finalProfile)
        return result
    }

    type CompleteUserProfileBase = UserProfile & {
        userName: string;
        bio: string;
        interests: number[];
        genres: number[];
        latitude: number;
        longitude: number;
        searchRadius: number;
    }

    function hasCompleteBaseProfile(profile: UserProfile): profile is CompleteUserProfileBase {
        return (
            typeof profile.userName === "string" &&
            typeof profile.bio === "string" &&
            Array.isArray(profile.interests) &&
            Array.isArray(profile.genres) &&
            typeof profile.latitude === "number" &&
            typeof profile.longitude === "number" &&
            typeof profile.searchRadius === "number"
        )
    }

    function buildUserProfileCreation(profile: UserProfile): UserProfileCreation | null {
        if (!hasCompleteBaseProfile(profile)) {
            return null
        }

        const targetGenres = profile.branchChoice === "same" ? profile.genres : profile.targetGenres

        if (!Array.isArray(targetGenres)) {
            return null
        }

        return {
            userName: profile.userName,
            bio: profile.bio,
            interests: profile.interests,
            genres: profile.genres,
            targetGenres,
            latitude: profile.latitude,
            longitude: profile.longitude,
            searchRadius: profile.searchRadius,
            ...(typeof profile.pictureUrl === "string" ? { pictureUrl: profile.pictureUrl } : {}),
        }
    }

    return {
        userProfile,
        setUserProfile,
        interestsOptions,
        genresOptions,
        isLoadingTags,
        tagsError,
        imageFile,
        isUploadingImage,
        imageError,
        previewUrl,
        fieldErrors,
        validateCard,
        clearFieldError,
        clearAllErrors,
        handleChange,
        toggleButtonNames,
        handleBranchChoice,
        getUserCoords,
        getSearchRadius,
        handleImageChange,
        handleImageUpload,
        submitUserProfile,
    }
}
