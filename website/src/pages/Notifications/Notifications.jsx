import NotificationsHeader from '../../components/notifications/NotificationsHeader';
import NotificationsList from '../../components/notifications/NotificationsList';
import { useState, useEffect } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'TABMARKO_DATA_PUSH') {
                const data = event.data.data;
                const newNotifications = [];
                
                // Add some fun dummy notifications for the hackathon
                newNotifications.push({
                    id: 1,
                    title: "AI grouped 12 tabs",
                    description: 'Created a new collection "Design Research" from loosely related tabs.',
                    time: "2h ago",
                    icon: "auto_awesome",
                    iconBg: "#E8F0FE",
                    iconColor: "#1A73E8",
                });
                
                if (data.stats && data.stats.dupeTabs > 0) {
                    newNotifications.push({
                        id: 4,
                        title: "Duplicates detected",
                        description: `Found ${data.stats.dupeTabs} duplicate tabs across your windows. Head to AI Suggestions to clean them!`,
                        time: "Just now",
                        icon: "content_copy",
                        iconBg: "#F3F4F5",
                        iconColor: "#6B7280",
                    });
                }
                
                setNotifications(prev => {
                    // Merge existing broken links notifications if they exist
                    const brokenLinkNotif = prev.find(n => n.id === 2);
                    if (brokenLinkNotif) {
                        newNotifications.splice(1, 0, brokenLinkNotif);
                    }
                    return newNotifications;
                });
            }
            
            if (event.data && event.data.type === 'TABMARKO_BROKEN_LINKS_RESULT') {
                const broken = event.data.data || [];
                if (broken.length > 0) {
                    setNotifications(prev => {
                        const existing = prev.filter(n => n.id !== 2);
                        const newNotif = {
                            id: 2,
                            title: "Broken links found",
                            description: `${broken.length} saved bookmarks are no longer reachable. Would you like to review them?`,
                            time: "Just now",
                            icon: "link_off",
                            iconBg: "#FDECEC",
                            iconColor: "#D93025",
                            action: "Review Links",
                        };
                        return [existing[0], newNotif, ...existing.slice(1)].filter(Boolean);
                    });
                }
            }
        };

        window.addEventListener('message', handleMessage);
        window.postMessage({ type: 'TABMARKO_REFRESH' }, '*');
        
        // Also trigger a background scan for broken links so we can populate that notification
        window.postMessage({ type: 'TABMARKO_SCAN_LINKS' }, '*');
        
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <main className='ml-40 mt-16 min-h-screen p-8'>
            <div className='mx-auto max-w-3xl'>
                <NotificationsHeader />
                {notifications.length === 0 ? (
                    <div className='flex justify-center items-center h-64 border border-[#c1c6d6] bg-white rounded-xl'>
                        <p className='text-gray-500 animate-pulse text-lg'>Checking for new notifications...</p>
                    </div>
                ) : (
                    <NotificationsList 
                        notifications={notifications}
                    />
                )}
            </div>
        </main>
    )
}

export default Notifications;