import { useEffect, useState } from 'react';
import CollectionHeader from '../../components/collections/CollectionsHeader';
import CollectionGrid from '../../components/collections/CollectionGrid';
import { fetchTableRows } from '../../lib/supabaseClient';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCollections() {
            try {
                const tabsData = await fetchTableRows('tab_ai_meta');
                const bookmarksData = await fetchTableRows('bookmark_ai_meta');

                const groups = {};
                
                const processItem = (item) => {
                    const cat = item.category;
                    if (!cat) return;
                    if (!groups[cat]) {
                        groups[cat] = { items: 0, updated: new Date(item.created_at) };
                    }
                    groups[cat].items += 1;
                    const itemDate = new Date(item.created_at);
                    if (itemDate > groups[cat].updated) {
                        groups[cat].updated = itemDate;
                    }
                };

                (tabsData || []).forEach(processItem);
                (bookmarksData || []).forEach(processItem);

                const collectionArray = Object.keys(groups).map((cat, index) => {
                    return {
                        id: index,
                        title: cat,
                        icon: getIconForCategory(cat),
                        iconBg: getBgColorForCategory(cat),
                        iconColor: getTextColorForCategory(cat),
                        items: groups[cat].items,
                        updated: formatTimeAgo(groups[cat].updated)
                    };
                });

                setCollections(collectionArray);
            } catch (err) {
                console.error("Failed to load collections", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCollections();
    }, []);

    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                <CollectionHeader />
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500 animate-pulse text-lg'>Curating collections...</p>
                    </div>
                ) : (
                    <CollectionGrid collections={collections} />
                )}
            </div>
        </main>
    )
}

function getIconForCategory(category) {
    const text = category.toLowerCase();
    if (text.includes('study') || text.includes('learning')) return 'school';
    if (text.includes('dev') || text.includes('code')) return 'code';
    if (text.includes('design')) return 'brush';
    if (text.includes('music') || text.includes('media')) return 'play_circle';
    if (text.includes('shopping')) return 'shopping_cart';
    if (text.includes('news')) return 'article';
    return 'folder';
}

function getBgColorForCategory(category) {
    const colors = ['#E8F0FE', '#F5E8FF', '#E6F4EA', '#FEF7E0', '#FCE8E6', '#F3F4F5'];
    const index = [...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
}

function getTextColorForCategory(category) {
    const colors = ['#1A73E8', '#9333EA', '#137333', '#B06000', '#C5221F', '#5F6368'];
    const index = [...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
}

export default Collections;