import InactiveTabsHeader from '../../components/inactiveTabs/InactiveTabsHeader';
import InactiveSummaryCards from '../../components/inactiveTabs/InactiveSummaryCards';
import InactiveTabSection from '../../components/inactiveTabs/InactiveTabSection';

import { useState, useEffect } from 'react';

const InactiveTabs = () => {
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'TABMARKO_DATA_PUSH') {
                setTabs(event.data.data.tabs || []);
            }
        };

        window.addEventListener('message', handleMessage);
        window.postMessage({ type: 'TABMARKO_REFRESH' }, '*');
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;
    
    // Group tabs
    const inactive30 = [];
    const inactive14 = [];
    const inactive7 = [];

    tabs.forEach(tab => {
        // Fallback to fake old dates if testing
        const lastAccessed = tab.lastAccessed || now;
        const daysInactive = (now - lastAccessed) / msInDay;

        if (daysInactive >= 30) inactive30.push(tab);
        else if (daysInactive >= 14) inactive14.push(tab);
        else if (daysInactive >= 7) inactive7.push(tab);
    });

    const summaryCards = [
        {
            id: 1,
            title: "7+ Days Inactive",
            value: inactive7.length,
            label: "tabs",
            icon: "history",
            iconColor: "#0F766E",
            valueColor: "#191c1d",
        },
        {
            id: 2,
            title: "14+ Days Inactive",
            value: inactive14.length,
            label: "tabs",
            icon: "update",
            iconColor: "#1A73E8",
            valueColor: "#191c1d",
        },
        {
            id: 3,
            title: "30+ Days Inactive",
            value: inactive30.length,
            label: "tabs",
            icon: "hourglass_empty",
            iconColor: "#EF4444",
            valueColor: "#EF4444",
        },
    ];

    const formatTab = (t) => ({
        id: t.id,
        title: t.title,
        url: t.tab_url || t.url,
        icon: "language",
        color: "#E5E7EB",
        lastAccessed: t.lastAccessed
    });

    const sections = [];
    if (inactive30.length > 0) sections.push({ id: 1, title: "30+ Days Inactive", icon: "hourglass_empty", iconColor: "#EF4444", tabs: inactive30.map(formatTab) });
    if (inactive14.length > 0) sections.push({ id: 2, title: "14+ Days Inactive", icon: "update", iconColor: "#1A73E8", tabs: inactive14.map(formatTab) });
    if (inactive7.length > 0) sections.push({ id: 3, title: "7+ Days Inactive", icon: "history", iconColor: "#0F766E", tabs: inactive7.map(formatTab) });

    const handleArchive = (id) => {
        window.postMessage({ type: 'TABMARKO_ARCHIVE_TABS', ids: [id] }, '*');
        setTabs(current => current.filter(t => t.id !== id));
    };

    const handleDismiss = (id) => {
        window.postMessage({ type: 'TABMARKO_CLOSE_TABS', ids: [id] }, '*');
        setTabs(current => current.filter(t => t.id !== id));
    };

    const handleArchiveAll30 = () => {
        const ids = inactive30.map(t => t.id);
        if (ids.length > 0) {
            window.postMessage({ type: 'TABMARKO_ARCHIVE_TABS', ids }, '*');
            setTabs(current => current.filter(t => !ids.includes(t.id)));
        }
    };

    const handleArchiveSection = (sectionTabs) => {
        const ids = sectionTabs.map(t => t.id);
        if (ids.length > 0) {
            window.postMessage({ type: 'TABMARKO_ARCHIVE_TABS', ids }, '*');
            setTabs(current => current.filter(t => !ids.includes(t.id)));
        }
    };

    return (
        <main className='min-h-screen bg-[#fafafa] px-4 pb-10 pt-24 md:ml-40 md:px-8'>
            <div className='mx-auto max-w-7xl'>
                <InactiveTabsHeader onArchiveAll30={handleArchiveAll30} count30={inactive30.length} />
                <InactiveSummaryCards cards={summaryCards} />

                {sections.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-xl border border-[#c1c6d6] bg-white shadow-sm mt-10">
                        <p className="text-gray-500 text-lg">No inactive tabs found. You're all caught up! 🎉</p>
                    </div>
                ) : (
                    <div className='space-y-10 mt-10'>
                        {sections.map((section) => (
                            <InactiveTabSection
                                key={section.id}
                                section={section}
                                onArchive={handleArchive}
                                onDismiss={handleDismiss}
                                onArchiveSection={() => handleArchiveSection(section.tabs)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default InactiveTabs;