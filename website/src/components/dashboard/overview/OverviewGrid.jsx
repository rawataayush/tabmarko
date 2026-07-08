import OverviewCard from './OverviewCard'
import { useEffect, useState } from 'react';
import { fetchTableRows } from '../../../lib/supabaseClient';

const OverviewGrid = () => {
    const [stats, setStats] = useState([
        { id: 1, icon: 'tab', value: 0, title: 'Tabs Organized' },
        { id: 2, icon: 'bookmark', value: 0, title: 'Bookmarks' },
        { id: 3, icon: 'content_copy', value: 0, title: 'Duplicate Tabs' },
        { id: 4, icon: 'link_off', value: 0, title: 'Broken Links' },
        { id: 5, icon: 'timer_off', value: 0, title: 'Inactive Tabs' },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadStats() {
            try {
                const [tabs, bookmarks] = await Promise.all([
                    fetchTableRows('tab_ai_meta'),
                    fetchTableRows('bookmark_ai_meta')
                ]);

                if (!cancelled) {
                    const tabUrlSet = new Set();
                    let dupeTabs = 0;
                    if (tabs) {
                        for (const t of tabs) {
                            const norm = (t.tab_url || t.url || '').split('?')[0].replace(/\/$/, '');
                            if (tabUrlSet.has(norm)) dupeTabs++;
                            else tabUrlSet.add(norm);
                        }
                    }

                    setStats([
                        { id: 1, icon: 'tab', value: tabs?.length || 0, title: 'Tabs Organized' },
                        { id: 2, icon: 'bookmark', value: bookmarks?.length || 0, title: 'Bookmarks' },
                        { id: 3, icon: 'content_copy', value: dupeTabs, title: 'Duplicate Tabs' },
                        { id: 4, icon: 'link_off', value: 0, title: 'Broken Links' },
                        { id: 5, icon: 'timer_off', value: 0, title: 'Inactive Tabs' },
                    ]);
                }
            } catch (error) {
                console.warn("Database not available, stats unavailable:", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        // Small delay to let the content script inject
        setTimeout(loadStats, 300);
        return () => { cancelled = true; };
    }, []);

    return (
        <section className='mb-6 text-[#191c1d]'>
            <h2 className='mb-6 font-semibold text-2xl text-[#191c1d]'>
                Today's Overview
            </h2>

            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
                {stats.map((stat) => (
                    <OverviewCard
                        key={stat.id}
                        icon={stat.icon}
                        value={loading ? "..." : stat.value}
                        title={stat.title}
                    />
                ))}
            </div>
        </section>
    )
}

export default OverviewGrid;