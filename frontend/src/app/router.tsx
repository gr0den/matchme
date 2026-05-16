import { createBrowserRouter } from "react-router-dom";

import LoginRegisterPage from "../features/auth/pages/LoginRegisterPage";
/* import RegisterPage from "@/features/auth/pages/RegisterPage"; */

export const router = createBrowserRouter([
    {
        path: "/",
        element:<LoginRegisterPage />,
    },
    /* {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    }, */
]);