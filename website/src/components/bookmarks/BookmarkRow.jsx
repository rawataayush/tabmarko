import BookmarkActions from './BookmarkActions';

const BookmarkRow = ({ bookmark, onDelete }) => {
    return (
        <div className='grid grid-cols-[minmax(0,4fr)_160px_140px_120px] items-center gap-6 rounded-xl border border-[#c1c6d6] bg-white p-4 transition hover:shadow-sm'>

            {/* Bookmark */}
            <div className='flex items-center gap-4 overflow-hidden'>

                {bookmark.image ? (
                    <img
                        src={bookmark.image}
                        alt={bookmark.title}
                        className='h-10 w-10 rounded-lg object-cover'
                    />
                ) : (
                    <div
                        className='flex h-10 w-10 items-center justify-center rounded-lg text-white'
                        style={{ backgroundColor: bookmark.color }}
                    >
                        <span className='material-symbols-outlined'>
                            {bookmark.icon}
                        </span>
                    </div>
                )}

                <div className='overflow-hidden'>
                    <h3 className='truncate font-medium text-[#191c1d]'>
                        {bookmark.title}
                    </h3>

                    <p className='truncate text-sm text-[#6b7280]'>
                        {bookmark.url}
                    </p>
                </div>

            </div>

            {/* Category */}
            <div>
                <span className='rounded-full bg-[#e8f0fe] px-2 py-1 text-xs text-[#1A73E8]'>
                    {bookmark.category}
                </span>
            </div>

            {/* Created */}
            <div>
                <p className='text-sm text-[#6b7280]'>
                    {bookmark.createdAt}
                </p>
            </div>

            {/* Actions */}
            <div className='justify-self-end'>
                <BookmarkActions bookmark={bookmark} onDelete={onDelete} />
            </div>

        </div>
    );
};

export default BookmarkRow;