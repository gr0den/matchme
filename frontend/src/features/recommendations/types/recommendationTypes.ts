export type RecommendedUser = {
    id: number;
    userName: string;
    pictureUrl: string;
    bio: string;
}

export type RecommendationCardProps = {
    user: RecommendedUser;
    busyAction: RecommendationAction | null;
    isAboutOpen: boolean;
    onToggleAbout: () => void;
    onConnect: () => void;
    onDismiss: () => void;
}

export type ConnectionRequest = {
    requesterId: number;
    targetUserId: number;
}

export type RecommendationAction = "connect" | "dismiss"
