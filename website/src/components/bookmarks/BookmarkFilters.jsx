import { useState, useRef, useEffect } from 'react';
import FilterChips from '../common/FilterChips/FilterChips';

const defaultCategories = ["All", "Study", "Development", "Design", "Learning"];

const BookmarkFilters = ({selectedFilter, setSelectedFilter, categories = []}) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

    const allCats = Array.from(new Set([...defaultCategories, ...categories]));
    
    // Show first 5 in chips, put the rest in the dropdown
    const visibleCats = allCats.slice(0, 5).map(c => ({label: c, value: c}));
    const hiddenCats = allCats.slice(5);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <FilterChips
            filters={visibleCats}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
        >
            {hiddenCats.length > 0 && (
                <div className="relative" ref={popupRef}>
                    <button 
                        onClick={() => setShowPopup(!showPopup)}
                        className={`flex items-center justify-center h-[36px] w-[36px] rounded-full transition ${showPopup ? 'bg-[#1A73E8] text-white' : 'bg-[#f3f4f5] text-[#191c1d] hover:bg-[#e3e2e6]'}`}
                        title="More Categories"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                    
                    {showPopup && (
                        <div className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-[#c1c6d6] bg-white p-2 shadow-lg z-50">
                            <div className="max-h-60 overflow-y-auto custom-scrollbar pr-1">
                                {hiddenCats.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedFilter(cat);
                                            setShowPopup(false);
                                        }}
                                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition ${selectedFilter === cat ? 'bg-[#e8f0fe] text-[#1A73E8] font-medium' : 'text-[#414754] hover:bg-[#f3f4f5]'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </FilterChips>
    )
}

export default BookmarkFilters;