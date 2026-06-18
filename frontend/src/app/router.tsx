import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginRegisterPage from "../features/auth/pages/LoginRegisterPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import { useNotificationsWebSocket } from "../shared/hooks/useNotificationsWebSocket";

import { useAuth } from "../shared/context/AuthContext";

const RootLayout = () =>
{
    const { currentUserId } = useAuth();

    useNotificationsWebSocket(currentUserId);
import RecommendationsPage from "../features/recommendations/pages/RecommendationsPage";

    return (
        <>
            <Outlet />
        </>
    );
};

export const router: any = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <LoginRegisterPage />,
            },
            {
                path: "/profile",
                element: <ProfilePage />,
            },
            {
                path: "/recommendations",
                element: <RecommendationsPage />,
            },
        ]
    }
]);