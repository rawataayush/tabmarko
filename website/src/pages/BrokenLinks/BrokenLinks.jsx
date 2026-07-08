import BrokenLinksHeader from "../../components/brokenLinks/BrokenLinksHeader";
import BrokenLinksFilters from "../../components/brokenLinks/BrokenLinksFilters";
import BrokenLinksTable from "../../components/brokenLinks/BrokenLinksTable";
import { useState, useEffect } from "react";

const BrokenLinks = () => {

    const [selectedFilter, setSelectedFilter] = useState('All');
    const [brokenLinks, setBrokenLinks] = useState([]);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'TABMARKO_BROKEN_LINKS_RESULT') {
                setBrokenLinks(event.data.data || []);
                setIsScanning(false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleScan = () => {
        setIsScanning(true);
        window.postMessage({ type: 'TABMARKO_SCAN_LINKS' }, '*');
    };

    const handleDelete = (id) => {
        window.postMessage({ type: 'TABMARKO_DELETE_BOOKMARKS', ids: [id] }, '*');
        setBrokenLinks(current => current.filter(link => link.id !== id));
    };

    const handleDeleteAll = () => {
        const ids = brokenLinks.map(link => link.id);
        if (ids.length > 0) {
            window.postMessage({ type: 'TABMARKO_DELETE_BOOKMARKS', ids }, '*');
            setBrokenLinks([]);
        }
    };

    // Make sure we match 'All Broken' instead of 'All' if that's what the filter uses
    // The filter in BrokenLinksFilters.jsx seems to use 'All Broken' based on the screenshot, but wait, the default was 'All'.
    // Let's check `selectedFilter === 'All Broken' || selectedFilter === 'All'` to be safe.
    const filteredBrokenLinks = (selectedFilter === 'All' || selectedFilter === 'All Broken') ? brokenLinks : brokenLinks.filter((link) => link.status === selectedFilter);
        
    return (
        <main className="mt-16 h-[calc(100vh-64px)] overflow-hidden md:ml-40">
            <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-4 md:px-6 lg:px-8">
                <BrokenLinksHeader 
                    totalCount={brokenLinks.length}
                    onScan={handleScan}
                    isScanning={isScanning}
                    onDeleteAll={handleDeleteAll}
                />
                <BrokenLinksFilters 
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />

                <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-[#c1c6d6] bg-white shadow-sm">
                    {brokenLinks.length === 0 && !isScanning ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-500">No broken links found. Click 'Scan Now' to check.</p>
                        </div>
                    ) : (
                        <BrokenLinksTable 
                            brokenLinks={filteredBrokenLinks}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </main>
    )
}

export default BrokenLinks;