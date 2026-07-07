import { NavLink } from "react-router-dom";

const navItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
        filled: true,
    },
    {
        name: "Tabs",
        path: "/dashboard/tabs",
        icon: "tab",
    },
    {
        name: "Bookmarks",
        path: "/dashboard/bookmarks",
        icon: "bookmark",
    },
    {
        name: "Collections",
        path: "/dashboard/collections",
        icon: "folder_special",
    },
    {
        name: "Knowledge Base",
        path: "/dashboard/knowledge-base",
        icon: "menu_book",
    },
    {
        name: "AI Suggestions",
        path: "/dashboard/ai-suggestions",
        icon: "auto_awesome",
    },
    {
        name: "Duplicate Finder",
        path: "/dashboard/duplicate-finder",
        icon: "content_copy",
    },
    {
        name: "Broken Links",
        path: "/dashboard/broken-links",
        icon: "link_off",
    },
    {
        name: "Inactive Tabs",
        path: "/dashboard/inactive-tabs",
        icon: "timer_off",
    },
];

const bottomNavItems = [
    {
        name: "Notifications",
        path: "/dashboard/notifications",
        icon: "notifications",
    },
    {
        name: "Settings",
        path: "/dashboard/settings",
        icon: "settings",
    },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const linksClasses = ({ isActive }) =>
        `
        flex items-center 
        ${isSidebarOpen ? 'justfiy-start gap-3' : 'justify-center'}
        rounded-lg px-3 py-1 transition-all duration-300
        ${isActive
            ? "bg-[#e3e2e6] text-[#005bbf] font-semibold"
            : "text-[#414754] hover:bg-[#e3e2e6]"
        }
        `;

    return (
        <nav
            className={`fixed left-0 top-16 z-40 flex flex-col h-full border-r border-[#c1c6d6] bg-[#f3f4f5] px-4 pt-5 pb-20
                transition-all duration-300
                ${isSidebarOpen ? "w-60" : "w-20"}
            `}
        >
            

            <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={linksClasses}
                        end={item.path === "/dashboard"}
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className="material-symbols-outlined shrink-0"
                                    style={{
                                        fontVariationSettings: `"FILL" 1 ${isActive ? 1 : 0}`,
                                    }}
                                >
                                    {item.icon}
                                </span>

                                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isSidebarOpen
                                    ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
            <div className="mt-auto flex flex-col gap-2">
                {bottomNavItems.map((item) => (
                    <NavLink key={item.path} to={item.path} className={linksClasses}>
                        {({ isActive }) => (
                            <>
                                <span
                                    className="material-symbols-outlined shrink-0"
                                    style={{
                                        fontVariationSettings: `'FILL' ${isActive ? 1 : 0}`,
                                    }}
                                >
                                    {item.icon}
                                </span>

                                <span
                                    className={`
                                        overflow-hidden
                                        whitespace-nowrap
                                        transition-all
                                        duration-300
                                        ${isSidebarOpen
                                            ? "w-auto opacity-100"
                                            : "w-0 opacity-0"
                                        }
                                            `}
                                >
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                className="mt-6 flex items-center justify-center rounded-lg p-2 text-[#414754] transition-colors hover:bg-[#E3E2E6]"
            >
                <span className="material-symbols-outlined">
                    {isSidebarOpen ? "menu_open" : "menu"}
                </span>
            </button>
        </nav>
    );
};

export default Sidebar;