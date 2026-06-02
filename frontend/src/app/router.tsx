import { createBrowserRouter } from "react-router-dom";

import LoginRegisterPage from "../features/auth/pages/LoginRegisterPage";
import ProfilePage from "../features/profile/pages/ProfilePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element:<LoginRegisterPage />,
    },
     {
        path: "/profile",
        element: <ProfilePage />,
    },
    /*{
        path: "/register",
        element: <RegisterPage />,
    }, */
]);