import { useState } from 'react';

const BookmarkSearch = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-sm lg:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
            </span>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Semantic Search with Gemini..."
                className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-12 text-sm text-[#191c1d] placeholder:text-gray-400 focus:border-[#1A73E8] focus:outline-none focus:ring-1 focus:ring-[#1A73E8]"
            />
            {query && (
                <button
                    type="button"
                    onClick={() => {
                        setQuery('');
                        onSearch('');
                    }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            )}
            <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#1A73E8] p-1.5 text-white disabled:opacity-50 hover:bg-blue-600 flex items-center justify-center transition-colors"
            >
                {isSearching ? (
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                ) : (
                    <span className="material-symbols-outlined text-sm">magic_button</span>
                )}
            </button>
        </form>
    );
};

export default BookmarkSearch;
