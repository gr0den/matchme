import {createBrowserRouter} from "react-router-dom";
import LoginRegisterPage from "../features/auth/pages/LoginRegisterPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import RecommendationsPage from "../features/recommendations/pages/RecommendationsPage";
import ConnectionsPage from "../features/connections/pages/ConnectionsPage";
import ChatPage from "../features/chat/pages/ChatPage";
import RootLayout from "./RootLayout";

export const router = createBrowserRouter([{
    element: <RootLayout/>, children: [{
        path: "/", element: <LoginRegisterPage/>,
    }, {
        path: "/profile", element: <ProfilePage/>,
    }, {
        path: "/recommendations", element: <RecommendationsPage/>,
    }, {
        path: "/connections", element: <ConnectionsPage/>,
    }, {
        path: "/chat", element: <ChatPage/>,
    },]
}]);
