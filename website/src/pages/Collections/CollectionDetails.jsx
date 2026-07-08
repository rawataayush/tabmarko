import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTableRows } from '../../lib/supabaseClient';

const CollectionDetails = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCollectionData() {
            try {
                // Fetch both tables
                const tabsData = await fetchTableRows('tab_ai_meta');
                const bookmarksData = await fetchTableRows('bookmark_ai_meta');

                // Filter by category
                const categoryDecoded = decodeURIComponent(categoryId);
                
                const filteredTabs = (tabsData || []).filter(t => t.category === categoryDecoded).map(t => {
                    const url = t.tab_url || t.url;
                    return {
                        ...t,
                        type: 'tab',
                        url: url,
                        title: t.title || titleFromUrl(url)
                    };
                });
                
                const filteredBookmarks = (bookmarksData || []).filter(b => b.category === categoryDecoded).map(b => {
                    const url = b.bookmark_url || b.url;
                    return {
                        ...b,
                        type: 'bookmark',
                        url: url,
                        title: b.title || b.bookmark_title || titleFromUrl(url)
                    };
                });

                // Combine and sort by created_at descending
                const combined = [...filteredTabs, ...filteredBookmarks].sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });

                setItems(combined);
            } catch (err) {
                console.error("Failed to load collection details:", err);
                setError("Failed to load items. Make sure you are synced.");
            } finally {
                setLoading(false);
            }
        }

        fetchCollectionData();
    }, [categoryId]);

    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-5xl'>
                <div className='mb-8 flex items-center gap-4'>
                    <button 
                        onClick={() => navigate(-1)}
                        className='flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#c1c6d6] text-[#414754] transition hover:bg-[#f3f4f5]'
                    >
                        <span className='material-symbols-outlined'>arrow_back</span>
                    </button>
                    <div>
                        <h2 className='text-3xl font-bold text-[#191c1d] capitalize'>{decodeURIComponent(categoryId)} Collection</h2>
                        <p className='mt-1 text-[#414754]'>
                            {items.length} items curated by AI
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className='flex h-64 items-center justify-center'>
                        <p className='text-gray-500 animate-pulse text-lg'>Loading collection...</p>
                    </div>
                ) : error ? (
                    <p className='mt-4 text-sm text-red-600'>{error}</p>
                ) : items.length === 0 ? (
                    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-[#c1c6d6] py-16 bg-white'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f5] text-[#6b7280]'>
                            <span className='material-symbols-outlined text-2xl'>inventory_2</span>
                        </div>
                        <h3 className='mt-4 font-medium text-[#191c1d]'>Collection is empty</h3>
                        <p className='mt-1 text-sm text-[#6b7280]'>
                            No tabs or bookmarks found in this category.
                        </p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {items.map((item, idx) => (
                            <a 
                                key={`${item.type}-${item.id || idx}`} 
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='flex items-center justify-between rounded-xl border border-[#c1c6d6] bg-white p-4 transition hover:shadow-sm group'
                            >
                                <div className='flex items-center gap-4 overflow-hidden'>
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.type === 'tab' ? 'bg-[#E8F0FE] text-[#1A73E8]' : 'bg-[#F5E8FF] text-[#9333EA]'}`}>
                                        <span className='material-symbols-outlined'>
                                            {item.type === 'tab' ? 'tab' : 'bookmark'}
                                        </span>
                                    </div>
                                    <div className='overflow-hidden'>
                                        <h3 className='truncate font-medium text-[#191c1d] group-hover:text-[#1A73E8] transition-colors'>
                                            {item.title}
                                        </h3>
                                        <p className='truncate text-sm text-[#6b7280]'>
                                            {item.url}
                                        </p>
                                    </div>
                                </div>
                                <div className='ml-4 shrink-0 text-right'>
                                    <p className='text-xs font-medium text-[#6b7280] uppercase tracking-wider mb-1'>{item.type}</p>
                                    <p className='text-xs text-[#a0a4ab]'>{formatCreatedAt(item.created_at)}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

function titleFromUrl(url) {
    if (!url) return 'Untitled';
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

function formatCreatedAt(value) {
    if (!value) return 'just now';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export default CollectionDetails;
