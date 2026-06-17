import { createBrowserRouter } from "react-router-dom";

import LoginRegisterPage from "../features/auth/pages/LoginRegisterPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import RecommendationsPage from "../features/recommendations/pages/RecommendationsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element:<LoginRegisterPage />,
    },
     {
        path: "/profile",
        element: <ProfilePage />,
    },
    {
        path: "/recommendations",
        element: <RecommendationsPage />,
    }, 
]);