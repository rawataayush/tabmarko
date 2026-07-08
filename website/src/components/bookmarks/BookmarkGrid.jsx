import BookmarkCard from './BookmarkCard';

const BookmarkGrid = ({ bookmarks, onDelete }) => {
    if (bookmarks.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-[#c1c6d6] py-16'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f5] text-[#6b7280]'>
                    <span className='material-symbols-outlined text-2xl'>bookmark_border</span>
                </div>
                <h3 className='mt-4 font-medium text-[#191c1d]'>No bookmarks found</h3>
                <p className='mt-1 text-sm text-[#6b7280]'>
                    Try adjusting your filters or sync new bookmarks from the extension.
                </p>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {bookmarks.map((bookmark) => (
                <BookmarkCard 
                    key={bookmark.id} 
                    bookmark={bookmark} 
                    onDelete={onDelete} 
                />
            ))}
        </div>
    );
};

export default BookmarkGrid;
