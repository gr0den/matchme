// Parent component for Card components
// Manages card index and collects data (userProfile)

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { differentPreferenceCardFlow, mainCardFlow, samePreferenceCardFlow } from "../types/cardTypes";
import TextCard from "../components/TextCard";
import ButtonCard from "../components/ButtonCard";
import QuestionCard from "../components/QuestionCard";
import LocationCard from "../components/LocationCard";
import PictureCard from "../components/PictureCard";
import { fetchGenres, fetchInterests, uploadProfileImage } from "../api/profileApi";
import type { ButtonData, CardConfig, UserProfile } from "../types/cardTypes";

export default function CardFlow() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activeFlow, setActiveFlow] = useState<"main" | "same" | "different">("main")
    const [userProfile, setUserProfile] = useState<UserProfile>({})
    const [interestsOptions, setInterestsOptions] = useState<ButtonData[]>([])
    const [genresOptions, setGenresOptions] = useState<ButtonData[]>([])
    const [isLoadingTags, setIsLoadingTags] = useState(true)
    const [tagsError, setTagsError] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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

                if (!isMounted) { // check if component still exists
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

        return () => { // cleanup function
            isMounted = false
        }
    }, []) // empty array -> run only once per component mount

    function getCardsForFlow(flow: "main" | "same" | "different") {
        if (flow === "same") {
            return samePreferenceCardFlow
        }

        if (flow === "different") {
            return differentPreferenceCardFlow
        }

        return mainCardFlow
    }

    const cards = getCardsForFlow(activeFlow)
    const currentCard = cards[currentIndex]

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
                    ? selectedNames.filter(item => item !== value) // remove name
                    : [...selectedNames, value], // add name
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

    function nextCard() {
        if (activeFlow === "main" && currentIndex < mainCardFlow.length - 1) {
            setCurrentIndex(prev => prev + 1)
            return
        }

        if (activeFlow === "main" && currentIndex === mainCardFlow.length - 1) {
            if (userProfile.branchChoice === "same" || userProfile.branchChoice === "different") {
                setActiveFlow(userProfile.branchChoice)
                setCurrentIndex(0)
            }
            return
        }

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    function prevCard() {
        if (activeFlow !== "main" && currentIndex === 0) {
            setActiveFlow("main")
            setCurrentIndex(mainCardFlow.length - 1)
            return
        }

        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    function renderCard(card: CardConfig) {
        if (card.type === "text" || card.type === "textarea") {
            return (
                <TextCard
                    config={card}
                    value={card.id === "userName" ? userProfile.userName ?? "" : userProfile.bio ?? ""}
                    onChange={handleChange}
                />
            )
        }

        if (card.type === "button") {
            let names = genresOptions
            let selectedNames = userProfile.genres ?? []

            if (card.id === "interests") {
                names = interestsOptions
                selectedNames = userProfile.interests ?? []
            } else if (card.id === "targetGenres") {
                names = genresOptions
                selectedNames = userProfile.targetGenres ?? []
            }

            return (
                <>
                    <ButtonCard
                        title={card.title}
                        names={names}
                        selectedNames={selectedNames}
                        onToggle={(id) => toggleButtonNames(card.id as "interests" | "genres" | "targetGenres", id)}
                    />
                    {isLoadingTags && <p>Loading options...</p>}
                    {tagsError && <p role="alert">{tagsError}</p>}
                </>
            )
        }

        if (card.type === "question") {
            return (
                <QuestionCard
                    config={card}
                    selectedOption={userProfile.branchChoice}
                    onSelect={handleBranchChoice}
                />
            )
        }

        if (card.type === "location") {
            return <LocationCard 
                onClick={getUserCoords}
            />
        }

        if (card.type === "picture") {
            return (
                <>
                    <PictureCard
                        onChange={handleImageChange}
                        onUpload={handleImageUpload}
                        previewUrl={previewUrl ?? userProfile.pictureUrl}
                        isUploading={isUploadingImage}
                    />
                    {imageError && <p role="alert">{imageError}</p>}
                </>
            )
        }

        return null
    }

    function renderUserObject() {
        return (
            <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(userProfile, null, 2)}
            </pre>
        )
    }

    return (
        <div>
            <div>
                {currentCard && renderCard(currentCard)}
            </div>

            <div>
                <button onClick={prevCard} disabled={activeFlow === "main" && currentIndex === 0}>Back</button>
                <button
                    onClick={nextCard}
                    disabled={activeFlow === "main" && currentIndex === mainCardFlow.length - 1 && !userProfile.branchChoice}
                >
                    {activeFlow === "main" ? "Next" : "Continue"}
                </button>
                {renderUserObject()}
            </div>
        </div>
    )
}