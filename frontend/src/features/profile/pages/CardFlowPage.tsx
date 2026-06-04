// Parent component for Card components
// Manages card index and collects data (userProfile)

import { useState } from "react";
import { mainCardFlow } from "../types/cardTypes";
import TextCard from "../components/TextCard";
import ButtonCard from "../components/ButtonCard";
import type { ButtonCardConfig, TextCardConfig, UserProfile } from "../types/cardTypes";

export default function CardFlow() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [userProfile, setUserProfile] = useState<UserProfile>({})

    const currentCard = mainCardFlow[currentIndex]

    function handleChange(id: string, value: string) {
        setUserProfile(prev => ({
            ...prev,
            [id]: value
        }))
    }

    type PreferenceKey = "interests" | "genres";
    function toggleButtonNames(field: PreferenceKey, value: number) {
        setUserProfile(prev => {
            const selectedNames = 
            currentCard.id === "interests"
                ? (userProfile.interests ?? [])
                : (userProfile.genres ?? [])

            return {
                ...prev,
                [field]: selectedNames.includes(value)
                ? selectedNames.filter(item => item !== value)
                : [...selectedNames, value]
            }
        })
    }

    function nextCard() {
        if (currentIndex < mainCardFlow.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    function prevCard() {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const textCardConfig = mainCardFlow.find((card): card is TextCardConfig => card.id === "userName")
    const buttonCardConfig = mainCardFlow.find((card): card is ButtonCardConfig => card.id === "interests")
    const textAreaConfig = mainCardFlow.find((card): card is TextCardConfig => card.id === "bio")

    return (
        <div>
            <div>
                {textAreaConfig && (
                    <TextCard
                        config={textAreaConfig}
                        value={userProfile.bio ?? ""}
                        onChange={handleChange}
                    />
                )}
                {textCardConfig && (
                    <TextCard
                        config={textCardConfig}
                        value={userProfile.userName ?? ""}
                        onChange={handleChange}
                    />
                )}
                {buttonCardConfig && (
                    <ButtonCard
                        title={buttonCardConfig.title}
                        names={buttonCardConfig.buttonOptions ?? []}
                        selectedNames={userProfile.interests ?? []}
                        onToggle={(id) => toggleButtonNames("interests", id)}
                    />
                )}
            </div>

            <div>
                <button onClick={prevCard} disabled={currentIndex === 0}>Back</button>
                <button onClick={nextCard}>Next</button>
            </div>
        </div>
    )
}