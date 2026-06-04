//---------------- Card flow -------------------------------------------------------------------------------------------

export type UserProfile = {
    userName?: string;
    bio?: string;
    interests?: number[];
    genres?: number[];
    targetGenres?: number[];
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
    buttonOptions?: ButtonData[];
}

type CardConfig = TextCardConfig | ButtonCardConfig

export const mainCardFlow: CardConfig[] = [
    {id: "userName", title: "How should we call you?", type: "text"},
    {id: "bio", title: "Tell people what you are looking for on BookClub", type: "textarea"},
    {
        id: "interests",
        title: "Choose what interests you",
        buttonOptions: [
            {id: 1, name: "Reading"},
            {id: 2, name: "Travel"},
            {id: 3, name: "Cooking"},
        ],
    },
    {
        id: "genres",
        title: "Choose what genres you like",
        buttonOptions: [
            {id: 4, name: "Fantasy"},
            {id: 5, name: "Mystery"},
            {id: 6, name: "Sci-Fi"},
        ],
    },
]

export const samePreferenceCardFlow: CardConfig[] = [

]

export const differentPreferenceCardFlow: CardConfig[] = [

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