import Sidebar  from '../components/navigation/Sidebar';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/navigation/Topbar';
import { useState } from 'react'

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className='min-h-screen bg-background'>
            <Topbar />
            <Sidebar 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                />
            <main className={`pt-2 transition-all duration-300 ${
                isSidebarOpen ? 'ml-20' : 'ml-0'
                }`
            }>
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout;