import ActivityItem from './ActivityItem'
import { useEffect, useState } from 'react';
import { fetchTabs } from '../../../lib/extensionBridge';

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function loadActivity() {
            try {
                const tabs = await fetchTabs().catch(() => []);
                if (!cancelled && tabs) {
                    const sorted = tabs
                        .slice(0, 3)
                        .map((tab) => ({
                            id: tab.id,
                            icon: 'tab',
                            title: `Categorized tab into '${tab.category || 'Uncategorized'}'`,
                            time: 'just now',
                        }));
                    setActivities(sorted);
                }
            } catch (error) {
                console.error("Failed to load recent activity:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        setTimeout(loadActivity, 300);
        return () => { cancelled = true; };
    }, []);

    return (
        <section>
            <h2 className='mb-4 px-2 text-2xl font-semibold text-[#191c1d]'>
                Recent Activity
            </h2>

            <div className="flex flex-col">
                {loading ? (
                    <p className="text-gray-500 px-2">Loading activity...</p>
                ) : activities.length > 0 ? (
                    activities.map((activity) => (
                        <ActivityItem
                            key={activity.id}
                            icon={activity.icon}
                            title={activity.title}
                            time={activity.time}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 px-2">No recent activity.</p>
                )}
            </div>
        </section>
    )
}

function formatTimeAgo(dateString) {
    if (!dateString) return 'just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

export default RecentActivity;