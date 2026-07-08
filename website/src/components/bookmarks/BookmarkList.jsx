import BookmarkRow from './BookmarkRow';

const BookmarkList = ({bookmarks, onDelete}) => {
    return (
        <div className='space-y-3'>
            {bookmarks.map((bookmark) => (
                <BookmarkRow 
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}

export default BookmarkList;