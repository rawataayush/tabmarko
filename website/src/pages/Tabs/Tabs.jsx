import TabsHeader from '../../components/tabs/TabsHeader';
import FilterBar from '../../components/tabs/FilterBar';
import TabGroupGrid from '../../components/tabs/TabGroupGrid';
import { useEffect, useState } from 'react';
import { fetchTableRows } from '../../lib/supabaseClient';

const Tabs = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [tabGroups, setTabGroups] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const filteredGroups = selectedFilter === 'All' ? tabGroups : tabGroups.filter((group) => group.category === selectedFilter)

    useEffect(() => {
        let cancelled = false;

        async function loadTabs() {
            try {
                const data = await fetchTableRows('tab_ai_meta');
                if (!cancelled) {
                    setTabGroups(data?.length ? groupTabRows(data) : []);
                    setError('');
                }
            } catch (loadError) {
                if (!cancelled) {
                    setTabGroups([]);
                    setError(`Failed to load from database. Open TabMarko extension and sync first.`);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        setTimeout(loadTabs, 300);
        return () => {
            cancelled = true;
        };
    }, []);
    
    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                <TabsHeader />
                <FilterBar 
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />
                {loading ? (
                    <div className='flex justify-center items-center h-64'>
                        <p className='text-gray-500 animate-pulse text-lg'>Loading tabs from extension...</p>
                    </div>
                ) : (
                    <TabGroupGrid 
                        groups={filteredGroups}
                    />
                )}
                {error && <p className='mt-4 text-sm text-red-600'>{error}</p>}
            </div>
        </main>
    )
}

function groupTabRows(rows) {
    return Object.values(rows.reduce((groups, row, index) => {
        const category = row.category || 'Uncategorized';
        if (!groups[category]) {
            groups[category] = {
                id: category,
                title: category,
                category,
                totalTabs: 0,
                updatedAt: 'just now',
                collapsed: false,
                tabs: [],
                hiddenTabs: 0,
            };
        }

        const url = row.tab_url || row.url || '';
        groups[category].tabs.push({
            id: row.id || `${category}-${index}`,
            title: row.title || titleFromUrl(url),
            url,
            favicon: row.favicon || '',
            icon: 'tab',
            smallIcon: 'tab',
            color: colorForCategory(category),
        });
        groups[category].totalTabs = groups[category].tabs.length;
        groups[category].hiddenTabs = Math.max(0, groups[category].tabs.length - 3);

        return groups;
    }, {}));
}

function titleFromUrl(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url || 'Untitled tab';
    }
}

function colorForCategory(category) {
    const palette = ['#1A73E8', '#0F9D58', '#A259FF', '#F59E0B', '#DB4437', '#64748B'];
    const index = [...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
    return palette[index];
}

export default Tabs;
