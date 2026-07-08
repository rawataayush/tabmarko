import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Landing from '../pages/Landing/Landing'
import Dashboard from '../pages/Dashboard/Dashboard';
import Tabs from "../pages/Tabs/Tabs";
import Bookmarks from '../pages/Bookmarks/Bookmarks';
import Collections from '../pages/Collections/Collections';
import CollectionDetails from '../pages/Collections/CollectionDetails';
import KnowledgeBase from '../pages/KnowledgeBase/KnowledgeBase';
import AISuggestions from '../pages/AISuggestions/AISuggestions';
import DuplicateFinder from '../pages/DuplicateFinder/DuplicateFinder';
import BrokenLinks from '../pages/BrokenLinks/BrokenLinks';
import InactiveTabs from '../pages/InactiveTabs/InactiveTabs';
import Notifications from '../pages/Notifications/Notifications';
import Settings from '../pages/Settings/Settings';
import LandingLayout from '../layouts/LandingLayout';
import DashboardLayout from "../layouts/DashboardLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                element: <LandingLayout />,
                children: [
                    {
                        index: true,
                        element: <Landing />,
                    },
                ],
            },
            { 
                path: "dashboard",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <Dashboard />},
                    { path: "tabs", element: <Tabs />},
                    { path: "bookmarks", element: <Bookmarks />},
                    { path: "collections", element: <Collections />},
                    { path: "collections/:categoryId", element: <CollectionDetails />},
                    { path: "knowledge-base", element: <KnowledgeBase />},
                    { path: "ai-suggestions", element: <AISuggestions />},
                    { path: "duplicate-finder", element: <DuplicateFinder /> },
                    { path: "broken-links", element: <BrokenLinks /> },
                    { path: "inactive-tabs", element: <InactiveTabs /> },
                    { path: "notifications", element: <Notifications /> },
                    { path: "settings", element: <Settings /> },
                ]
            },
            {
                path: "tabs",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <Tabs /> },
                ],
            },
            {
                path: "bookmarks",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <Bookmarks /> },
                ],
            },
            {
                path: "knowledge-base",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <KnowledgeBase /> },
                ],
            },
            {
                path: "ai-suggestions",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <AISuggestions /> },
                ],
            },
            {
                path: "duplicate-finder",
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <DuplicateFinder /> },
                ],
            },
        ],
    },
]);

export default router;
