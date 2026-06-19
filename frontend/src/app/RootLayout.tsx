import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext";
import { useNotificationsWebSocket } from "../shared/hooks/useNotificationsWebSocket";
import type { MatchMeNotification } from "../shared/hooks/useNotificationsWebSocket";

export type RootOutletContext = {
    connectionNotificationVersion: number;
}

export default function RootLayout() {
    const { currentUserId } = useAuth();
    const [connectionNotificationVersion, setConnectionNotificationVersion] = useState(0);

    const handleNotification = useCallback((notification: MatchMeNotification) => {
        if (notification.type === "CONNECTION_REQUEST" || notification.type === "CONNECTION_ACCEPTED") {
            setConnectionNotificationVersion((version) => version + 1);
        }
    }, []);

    useNotificationsWebSocket(currentUserId, handleNotification);

    return <Outlet context={{ connectionNotificationVersion }} />;
}
