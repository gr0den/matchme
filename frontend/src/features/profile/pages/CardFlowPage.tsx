// Parent component for Card components
// Manages card index and collects data (userProfile)

import { useState } from "react";
import { differentPreferenceCardFlow, mainCardFlow, samePreferenceCardFlow } from "../types/cardTypes";
import TextCard from "../components/TextCard";
import ButtonCard from "../components/ButtonCard";
import QuestionCard from "../components/QuestionCard";
import LocationCard from "../components/LocationCard";
import PictureCard from "../components/PictureCard";
import type { CardConfig, UserProfile } from "../types/cardTypes";

export default function CardFlow() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activeFlow, setActiveFlow] = useState<"main" | "same" | "different">("main")
    const [userProfile, setUserProfile] = useState<UserProfile>({})

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

    function toggleButtonNames(field: "interests" | "genres", value: number) {
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
            return (
                <ButtonCard
                    title={card.title}
                    names={card.buttonOptions ?? []}
                    selectedNames={card.id === "interests" ? userProfile.interests ?? [] : userProfile.genres ?? []}
                    onToggle={(id) => toggleButtonNames(card.id as "interests" | "genres", id)}
                />
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
            return <LocationCard />
        }

        if (card.type === "picture") {
            return <PictureCard />
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