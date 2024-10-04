import BookmarkList from './BookmarkList';
import { TBookmarkWithContent } from '@/actions/bookmark/types';

const BookmarkView = ({
  bookmarkData,
}: {
  bookmarkData: TBookmarkWithContent[] | null | { error: string };
}) => {
  // Check for null or error in bookmarkData
  const isError = bookmarkData !== null && 'error' in bookmarkData;

  return (
    <>
      {bookmarkData === null ? (
        <div className="mt-64 flex">
          <div className="text-2xl font-bold">Loading bookmarks...</div> {/* Loading state */}
        </div>
      ) : isError ? (
        <div className="mt-64 flex">
          <div className="text-2xl font-bold text-red-500">
            {bookmarkData.error} {/* Display the error message */}
          </div>
        </div>
      ) : !bookmarkData.length ? (
        <div className="mt-64 flex">
          <div className="text-2xl font-bold">No bookmarks added yet!</div>
        </div>
      ) : (
        <BookmarkList bookmarkData={bookmarkData} />
      )}
    </>
  );
};

export default BookmarkView;
