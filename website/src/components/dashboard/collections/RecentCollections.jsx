import CollectionCard from './CollectionCard';
import { useEffect, useState } from 'react';
import { fetchTabs } from '../../../lib/extensionBridge';
import { useNavigate } from 'react-router-dom';

const RecentCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function loadCollections() {
            try {
                const tabs = await fetchTabs().catch(() => []);
                if (!cancelled && tabs) {
                    const groups = tabs.reduce((acc, tab) => {
                        const cat = tab.category || 'Uncategorized';
                        acc[cat] = (acc[cat] || 0) + 1;
                        return acc;
                    }, {});
                    
                    const sorted = Object.entries(groups)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([name, count], index) => ({
                            id: index,
                            name,
                            items: count,
                            icon: 'folder',
                        }));
                    setCollections(sorted);
                }
            } catch (error) {
                console.error("Failed to load recent collections:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        setTimeout(loadCollections, 300);
        return () => { cancelled = true; };
    }, []);

    return (
        <section className='mt-4'>
            <h2 className='mb-6 text-2xl font-semibold text-[#191c1d]'>
                Recent Collections
            </h2>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {loading ? (
                    <p className="text-gray-500">Loading collections...</p>
                ) : collections.length > 0 ? (
                    collections.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            icon={collection.icon}
                            name={collection.name}
                            items={collection.items}
                            onClick={() => navigate(`/dashboard/collections/${encodeURIComponent(collection.name)}`)}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No collections found.</p>
                )}
            </div>
        </section>
    )
}

export default RecentCollections;