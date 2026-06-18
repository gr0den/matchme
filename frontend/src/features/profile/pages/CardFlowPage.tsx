// Parent component for Card components
// Manages card navigation (currentIndex, activeFlow) and renders cards

import { useState } from "react";
import { differentPreferenceCardFlow, mainCardFlow, samePreferenceCardFlow } from "../types/cardTypes";
import TextCard from "../components/TextCard";
import ButtonCard from "../components/ButtonCard";
import QuestionCard from "../components/QuestionCard";
import LocationCard from "../components/LocationCard";
import PictureCard from "../components/PictureCard";
import type { CardConfig, CardFlowProps } from "../types/cardTypes";
import { useUserProfile } from "../hooks/useUserProfile";
import "../styles/CardFlowPage.css"

export default function CardFlow({ onSubmitSuccess }: CardFlowProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activeFlow, setActiveFlow] = useState<"main" | "same" | "different">("main")
    const {
        userProfile,
        interestsOptions,
        genresOptions,
        isLoadingTags,
        tagsError,
        fieldErrors,
        validateCard,
        clearFieldError,
        handleChange,
        toggleButtonNames,
        handleBranchChoice,
        getUserCoords,
        getSearchRadius,
        handleImageChange,
        handleImageUpload,
        imageError,
        previewUrl,
        isUploadingImage,
        submitUserProfile,
    } = useUserProfile()

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

    function handleChangeWithErrorClear(id: string, value: string) {
        handleChange(id, value)
        clearFieldError(id)
    }

    function handleToggleWithErrorClear(field: "interests" | "genres" | "targetGenres", id: number) {
        toggleButtonNames(field, id)
        clearFieldError(field)
    }

    function handleBranchChoiceWithErrorClear(value: "same" | "different") {
        handleBranchChoice(value)
        clearFieldError("branchChoice")
    }

    function handleGetUserCoordsWithErrorClear() {
        getUserCoords()
        clearFieldError("location")
    }

    function handleGetSearchRadiusWithErrorClear(event: React.ChangeEvent<HTMLInputElement>) {
        getSearchRadius(event)
        clearFieldError("location")
    }

    function handleImageChangeWithErrorClear(event: React.ChangeEvent<HTMLInputElement>) {
        handleImageChange(event)
        clearFieldError("picture")
    }

    function nextCard() {
        // Validate current card before proceeding
        const error = validateCard(currentCard.id, userProfile)
        if (error) {
            return
        }

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

    async function handleSubmit() {
        try {
            await submitUserProfile()
            onSubmitSuccess()
        } catch (error) {
            console.error(error)
        }
    }

    function renderCard(card: CardConfig) {
        if (card.type === "text" || card.type === "textarea") {
            return (
                <TextCard
                    config={card}
                    value={card.id === "userName" ? userProfile.userName ?? "" : userProfile.bio ?? ""}
                    onChange={handleChangeWithErrorClear}
                    error={fieldErrors[card.id]}
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
                        onToggle={(id) => handleToggleWithErrorClear(card.id as "interests" | "genres" | "targetGenres", id)}
                        error={fieldErrors[card.id]}
                    />
                    {isLoadingTags && <p>Loading options...</p>}
                    {tagsError && <p className="profile-error" role="alert">{tagsError}</p>}
                </>
            )
        }

        if (card.type === "question") {
            return (
                <QuestionCard
                    config={card}
                    selectedOption={userProfile.branchChoice}
                    onSelect={handleBranchChoiceWithErrorClear}
                    error={fieldErrors[card.id]}
                />
            )
        }

        if (card.type === "location") {
            return <LocationCard 
                onClick={handleGetUserCoordsWithErrorClear}
                onChange={handleGetSearchRadiusWithErrorClear}
                error={fieldErrors[card.id]}
            />
        }

        if (card.type === "picture") {
            return (
                <>
                    <PictureCard
                        onChange={handleImageChangeWithErrorClear}
                        onUpload={handleImageUpload}
                        previewUrl={previewUrl ?? userProfile.pictureUrl}
                        isUploading={isUploadingImage}
                        error={fieldErrors[card.id]}
                    />
                    {imageError && <p className="profile-error" role="alert">{imageError}</p>}
                </>
            )
        }

        return null
    }

    function renderUserObject() {
        return (
            <pre className="profile-debug">
                {JSON.stringify(userProfile, null, 2)}
            </pre>
        )
    }

    return (
        <div className="card-flow-page">
            <div className="card-flow-card">
                {currentCard && renderCard(currentCard)}
            </div>

            <div className="card-flow-actions">
                <button onClick={prevCard} disabled={activeFlow === "main" && currentIndex === 0}>Back</button>
                <button
                    onClick={//nextCard
                        currentCard.type === "picture" ? handleSubmit : nextCard
                    }
                    disabled={activeFlow === "main" && currentIndex === mainCardFlow.length - 1 && !userProfile.branchChoice}
                >
                    {currentCard.type === "picture" ? "Submit" : "Next"}
                </button>
                {renderUserObject()}
            </div>
        </div>
    )
}
