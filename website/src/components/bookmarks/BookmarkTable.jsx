import BookmarkList from './BookmarkList';
import BookmarkHeader from './BookmarkHeader';

const BookmarkTable = ({bookmarks, onDelete}) => {
    return (
        <section>
            <BookmarkHeader />
            <BookmarkList 
                bookmarks={bookmarks}
                onDelete={onDelete}
            />
        </section>
    )
}

export default BookmarkTable;