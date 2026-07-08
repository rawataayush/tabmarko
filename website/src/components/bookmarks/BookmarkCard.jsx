import BookmarkActions from './BookmarkActions';

const BookmarkCard = ({ bookmark, onDelete }) => {
    return (
        <div className='flex flex-col gap-4 rounded-xl border border-[#c1c6d6] bg-white p-4 transition hover:shadow-sm'>
            <div className='flex items-start justify-between'>
                <div
                    className='flex h-12 w-12 items-center justify-center rounded-lg text-white'
                    style={{ backgroundColor: bookmark.color }}
                >
                    {bookmark.image ? (
                        <img
                            src={bookmark.image}
                            alt={bookmark.title}
                            className='h-full w-full rounded-lg object-cover'
                        />
                    ) : (
                        <span className='material-symbols-outlined text-2xl'>
                            {bookmark.icon}
                        </span>
                    )}
                </div>
                <BookmarkActions bookmark={bookmark} onDelete={onDelete} />
            </div>

            <div className='overflow-hidden'>
                <h3 className='truncate font-medium text-[#191c1d] mb-1' title={bookmark.title}>
                    {bookmark.title}
                </h3>
                <p className='truncate text-sm text-[#6b7280]' title={bookmark.url}>
                    {bookmark.url}
                </p>
            </div>

            <div className='mt-auto flex items-center justify-between pt-2'>
                <span className='rounded-full bg-[#e8f0fe] px-2 py-1 text-xs text-[#1A73E8]'>
                    {bookmark.category}
                </span>
                <p className='text-xs text-[#6b7280]'>
                    {bookmark.createdAt}
                </p>
            </div>
        </div>
    );
};

export default BookmarkCard;
