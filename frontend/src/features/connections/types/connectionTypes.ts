export type ConnectedUser = {
    id: number;
    userName: string;
    pictureUrl: string;
    bio: string;
}

export type ConnectionsResponse = {
    pendingConnections: number[];
    activeConnections: number[];
}

export type ConnectionRequest = {
    requesterId: number;
    targetUserId: number;
}

export type ConnectionAction = "accept" | "reject" | "disconnect"

export type ConnectionCardMode = "request" | "connection"

export type ConnectionCardProps = {
    user: ConnectedUser;
    mode: ConnectionCardMode;
    busyAction: ConnectionAction | null;
    isAboutOpen: boolean;
    onToggleAbout: () => void;
    onAccept?: () => void;
    onReject?: () => void;
    onDisconnect?: () => void;
}
