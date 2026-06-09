import type { ChangeEvent } from "react";

//---------------- Card flow -------------------------------------------------------------------------------------------

export type UserProfile = {
    userName?: string;
    bio?: string;
    interests?: number[];
    genres?: number[];
    targetGenres?: number[];
    branchChoice?: "same" | "different";
    latitude?: number;
    longitude?: number;
    pictureUrl?: string;
}

export type TextCardConfig = {
    id: string;
    title: string;
    type: "text" | "textarea";
}

export type ButtonData = {
    id: number;
    name: string;
}

export type ButtonCardConfig = {
    id: string;
    title: string;
    type: "button";
    buttonOptions?: ButtonData[];
}

export type QuestionCardConfig = {
    id: string;
    title: string;
    type: "question";
    options: Array<{
        id: "same" | "different";
        label: string;
    }>;
}

export type LocationCardConfig = {
    id: string;
    title: string;
    type: "location";
}

export type PictureCardConfig = {
    id: string;
    title: string;
    type: "picture";
}

export type CardConfig = TextCardConfig | ButtonCardConfig | QuestionCardConfig | LocationCardConfig | PictureCardConfig

export const mainCardFlow: CardConfig[] = [
    {id: "userName", title: "How should we call you?", type: "text"},
    {id: "bio", title: "Tell people what you are looking for on BookClub", type: "textarea"},
    {
        id: "interests",
        title: "Choose what interests you",
        type: "button",
    },
    {
        id: "genres",
        title: "Choose what genres you like",
        type: "button",
    },
    {
        id: "branchChoice",
        title: "Are you looking for someone with the same preferences?",
        type: "question",
        options: [
            {id: "same", label: "Yes"},
            {id: "different", label: "No"},
        ],
    },
]

export const samePreferenceCardFlow: CardConfig[] = [
    {id: "location", title: "Where are you located?", type: "location"},
    {id: "picture", title: "Upload your profile picture (optional)", type: "picture"},
]

export const differentPreferenceCardFlow: CardConfig[] = [
    {
        id: "targetGenres",
        title: "Choose the genres you want to match with",
        type: "button",
    },
    {id: "location", title: "Where are you located?", type: "location"},
    {id: "picture", title: "Upload your profile picture (optional)", type: "picture"},
]

//---------------- Card props -------------------------------------------------------------------------------------------

export type TextCardProps = {
    config: TextCardConfig;
    value: string;
    onChange: (id: string, value: string) => void;
}

export type ButtonCardProps = {
    title: string;
    names: ButtonData[];
    selectedNames: number[];
    onToggle: (id: number) => void;
}

export type QuestionCardProps = {
    config: QuestionCardConfig;
    selectedOption?: "same" | "different";
    onSelect: (id: "same" | "different") => void;
}

export type LocationCardProps = {
    onClick: () => void;
}

export type PictureCardProps = {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => Promise<void> | void;
    previewUrl?: string;
    isUploading?: boolean;
}