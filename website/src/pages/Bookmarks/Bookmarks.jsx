import { useState } from 'react';
import BookmarksToolbar from '../../components/bookmarks/BookmarksToolbar';
import BookmarkTable from "../../components/bookmarks/BookmarkTable";
import Pagination from "../../components/bookmarks/Pagination";
import bookmarkData from '../../data/BookmarksData';

const Bookmarks = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filteredBookmarks = selectedFilter === 'All' 
        ? bookmarkData 
        : bookmarkData.filter((bookmark) => 
            bookmark.category === selectedFilter)
    return (
        <main className='mt-16 overflow-y-auto px-4 py-6 pb-24 md:ml-40 md:px-6 lg:px-8'>
            <div className='mx-auto max-w-7xl'>
                <BookmarksToolbar 
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                />
                <BookmarkTable 
                    bookmarks={filteredBookmarks}
                />
                <Pagination />
            </div>
        </main>
    )
}

export default Bookmarks;