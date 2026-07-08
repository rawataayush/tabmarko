const BookmarkActions = ({ bookmark, onDelete }) => {
    return (
        <div className='flex items-center gap-1'>
            <a 
                href={bookmark.url}
                target="_blank"
                rel="noreferrer"
                className='rounded-lg p-2 transition hover:bg-[#f3f4f5]'
                title="Open"
            >
                    <span className='material-symbols-outlined text-[18px]'>
                        open_in_new
                    </span>
            </a>

            <button 
                className='rounded-lg p-2 transition hover:bg-[#f3f4f5] opacity-50 cursor-not-allowed'
                title="Edit (Extension Only)"
            >
                    <span className='material-symbols-outlined text-[18px]'>
                        edit
                    </span>
            </button>

            <button 
                className='rounded-lg p-2 text-red-500 transition hover:bg-red-100'
                title="Delete"
                onClick={() => onDelete(bookmark.id)}
            >
                    <span className='material-symbols-outlined text-[18px]'>
                        delete
                    </span>
            </button>
        </div>
    )
}

export default BookmarkActions;