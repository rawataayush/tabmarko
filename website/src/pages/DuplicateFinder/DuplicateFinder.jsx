import DuplicateHeader from '../../components/duplicateFinder/DuplicateHeader';
import DuplicateToolbar from '../../components/duplicateFinder/DuplicateToolbar';
import DuplicateGrid from '../../components/duplicateFinder/DuplicateGrid';
import { useState, useEffect } from 'react';
import { fetchTableRows } from '../../lib/supabaseClient';

const DuplicateFinder = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [duplicateGroups, setDuplicateGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function loadDuplicates() {
            try {
                const tabs = await fetchTableRows('tab_ai_meta');
                if (!cancelled && tabs) {
                    // Group tabs by normalized URL
                    const urlMap = new Map();
                    tabs.forEach(tab => {
                        const normUrl = (tab.tab_url || tab.url || '').split('?')[0].replace(/\/$/, '');
                        if (!urlMap.has(normUrl)) {
                            urlMap.set(normUrl, []);
                        }
                        urlMap.get(normUrl).push(tab);
                    });

                    // Filter out non-duplicates
                    const dupes = Array.from(urlMap.values()).filter(group => group.length > 1);

                    const formattedGroups = dupes.map((group, index) => ({
                        id: index,
                        title: group[0].title || new URL(group[0].tab_url || group[0].url).hostname.replace(/^www\./, ''),
                        similarity: 'Exact Match',
                        items: group.map(tab => ({
                            id: tab.id,
                            title: tab.title || new URL(tab.tab_url || tab.url).hostname.replace(/^www\./, ''),
                            url: tab.tab_url || tab.url,
                            icon: 'tab',
                            color: '#1A73E8'
                        }))
                    }));

                    setDuplicateGroups(formattedGroups);
                }
            } catch (err) {
                if (!cancelled) {
                    setError('Failed to fetch from database. Please sync from the extension first.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDuplicates();
        return () => { cancelled = true; };
    }, []);

    const handleKeepBest = (group) => {
        // Keep the first item, close the rest
        const idsToClose = group.items.slice(1).map(item => item.id);
        if (idsToClose.length > 0) {
            window.postMessage({ type: 'TABMARKO_CLOSE_TABS', ids: idsToClose }, '*');
        }
        setDuplicateGroups(current => current.filter(g => g.id !== group.id));
    };

    const handleRemoveDuplicate = (group) => {
        // Also keep the first item, close the rest
        const idsToClose = group.items.slice(1).map(item => item.id);
        if (idsToClose.length > 0) {
            window.postMessage({ type: 'TABMARKO_CLOSE_TABS', ids: idsToClose }, '*');
        }
        setDuplicateGroups(current => current.filter(g => g.id !== group.id));
    };

    const filteredDuplicates = duplicateGroups; // Filter logic can be expanded if needed

    return (
        <main className='ml-40 min-h-screen overflow-y-auto bg-[#fafafa] p-8 pt-24'>
            <div className='mx-auto max-w-7xl'>
                <DuplicateHeader />
                <DuplicateToolbar 
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />
                
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500 animate-pulse text-lg'>Finding duplicates...</p>
                    </div>
                ) : error ? (
                    <p className='text-red-500 mt-4'>{error}</p>
                ) : duplicateGroups.length === 0 ? (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500 text-lg'>No duplicate tabs found! 🎉</p>
                    </div>
                ) : (
                    <DuplicateGrid
                        duplicateGroups={filteredDuplicates}
                        onKeepBest={handleKeepBest}
                        onRemoveDuplicate={handleRemoveDuplicate}
                    />
                )}
            </div>
        </main>
    )
}

export default DuplicateFinder;