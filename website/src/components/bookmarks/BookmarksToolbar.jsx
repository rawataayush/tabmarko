import BookmarkFilters from './BookmarkFilters';
import SortControls from './SortControls';
import ViewSwitcher from './ViewSwitcher';
import BookmarkSearch from './BookmarkSearch';

const BookmarksToolbar = ({selectedFilter, setSelectedFilter, onSearch, isSearching, viewMode, setViewMode, categories}) => {
    return (
        <section className='mb-8'>
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}
                <div>
                    <h1 className="text-3xl font-bold text-[#191c1d]">
                        Bookmarks
                    </h1>

                    <p className="mt-2 flex items-center gap-2 text-[#414754]">
                        <span className="material-symbols-outlined text-[#1A73E8]">
                            bookmark
                        </span>
                        Manage and organize all your saved bookmarks.
                    </p>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center gap-3">
                    <BookmarkSearch onSearch={onSearch} isSearching={isSearching} />
                    <SortControls />
                    <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
                </div>
            </div>

            {/* Filters */}
            <BookmarkFilters 
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                categories={categories}
            />
        </section>
    )
}

export default BookmarksToolbar;