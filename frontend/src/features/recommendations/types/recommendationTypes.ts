import type { Genre, Interest} from "../../profile/types/cardTypes"

export type RecommendedUser = {
    id: number;
    userName: string;
    pictureUrl: string;
    longitude: number;
    latitude: number;
    interests: Interest[];
    genres: Genre[];
    targetGenres: Genre[];
    searchRadius: number;
}

export type RecommendationCardProps = {
    user: RecommendedUser;
    onAccept: () => void;
    onReject: () => void;
}