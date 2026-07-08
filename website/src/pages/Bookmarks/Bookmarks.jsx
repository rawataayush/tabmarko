import { useEffect, useState } from 'react';
import BookmarksToolbar from '../../components/bookmarks/BookmarksToolbar';
import BookmarkTable from "../../components/bookmarks/BookmarkTable";
import BookmarkGrid from "../../components/bookmarks/BookmarkGrid";
import Pagination from "../../components/bookmarks/Pagination";
import { fetchTableRows, callEmbedAndSearch } from '../../lib/supabaseClient';

const Bookmarks = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [bookmarks, setBookmarks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        let cancelled = false;

        async function loadBookmarks() {
            try {
                const data = await fetchTableRows('bookmark_ai_meta');
                if (!cancelled) {
                    setBookmarks(data?.length ? mapBookmarkRows(data) : []);
                    setError('');
                }
            } catch (loadError) {
                if (!cancelled) {
                    setBookmarks([]);
                    setError(`Failed to load from database. Open TabMarko extension and sync first.`);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        setTimeout(loadBookmarks, 300);
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setLoading(true);
            fetchTableRows('bookmark_ai_meta')
                .then(data => setBookmarks(data?.length ? mapBookmarkRows(data) : []))
                .catch(() => setError('Failed to load from database.'))
                .finally(() => setLoading(false));
            return;
        }

        setIsSearching(true);
        try {
            const result = await callEmbedAndSearch(query);
            const rawMatches = result?.results || result?.data || result?.matches || [];
            if (rawMatches.length > 0) {
                setBookmarks(mapBookmarkRows(rawMatches));
                setError('');
            } else {
                setBookmarks([]);
                setError('No semantic matches found for your query.');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Semantic search failed or is unavailable.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleDelete = async (id) => {
        // For now, just remove from local state
        // Full delete would require extension bridge to call browser.bookmarks.remove
        setBookmarks(prev => prev.filter(b => b.id !== id));
    };

    const filteredBookmarks = selectedFilter === 'All' 
        ? bookmarks 
        : bookmarks.filter((bookmark) => 
            bookmark.category === selectedFilter)
            
    const uniqueCategories = Array.from(new Set(bookmarks.map(b => b.category))).filter(Boolean);
    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                <BookmarksToolbar 
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    onSearch={handleSearch}
                    isSearching={isSearching}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    categories={uniqueCategories}
                />
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500 animate-pulse text-lg'>Loading bookmarks from extension...</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <BookmarkTable 
                        bookmarks={filteredBookmarks}
                        onDelete={handleDelete}
                    />
                ) : (
                    <BookmarkGrid
                        bookmarks={filteredBookmarks}
                        onDelete={handleDelete}
                    />
                )}
                {error && <p className='mt-4 text-sm text-red-600'>{error}</p>}
                <Pagination />
            </div>
        </main>
    )
}

function mapBookmarkRows(rows) {
    return rows.map((row, index) => {
        const url = row.bookmark_url || row.url || '';
        const category = row.category || 'Uncategorized';

        return {
            id: row.id || index,
            title: row.title || titleFromUrl(url),
            url,
            category,
            folder: row.folder || '',
            createdAt: formatCreatedAt(row.created_at),
            icon: 'bookmark',
            color: colorForCategory(category),
            image: '',
        };
    });
}

function titleFromUrl(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url || 'Untitled bookmark';
    }
}

function formatCreatedAt(value) {
    if (!value) return 'just now';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));
}

function colorForCategory(category) {
    const palette = ['#1A73E8', '#0F9D58', '#A259FF', '#F59E0B', '#DB4437', '#64748B'];
    const index = [...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
    return palette[index];
}

export default Bookmarks;
