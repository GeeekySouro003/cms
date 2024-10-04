import { Bookmark } from '@prisma/client';
import { MouseEvent, useState } from 'react';
import { useAction } from './useAction';
import { createBookmark, deleteBookmark } from '@/actions/bookmark';
import { toast } from 'sonner';
import Link from 'next/link';

export const useBookmark = (
  bookmark: Bookmark | null,
  contentId: number | number[], // Handle both single and multiple content IDs
) => {
  const [addedBookmark, setAddedBookmark] = useState<Bookmark | null>(bookmark);
  const [isDisabled, setIsDisabled] = useState(false);

  // Action for creating a bookmark
  const { execute: executeCreateBookmark } = useAction(createBookmark, {
    onSuccess: (data: Bookmark) => {
      toast(
        <div className="flex items-center gap-2">
          Bookmark Added!
          <Link
            className="text-[#040fff]"
            href={'/bookmark'}
            onClick={() => {
              toast.dismiss();
            }}
            target="_blank"
          >
            Checkout all bookmarks
          </Link>
        </div>,
        { duration: 3000 },
      );
      setAddedBookmark(data); // Update state with new bookmark
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Action for deleting a bookmark
  const { execute: executeDeleteBookmark } = useAction(deleteBookmark, {
    onSuccess: () => {
      toast(
        <div className="flex items-center gap-2">
          <span>Bookmark Removed!</span>
        </div>,
        { duration: 3000 },
      );
      setAddedBookmark(null); // Remove bookmark from state
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Handle bookmark click (for single or multiple content items)
  const handleBookmark = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();

    try {
      setIsDisabled(true);
      if (addedBookmark) {
        // If it's already bookmarked, remove the bookmark
        await executeDeleteBookmark({
          id: addedBookmark.id,
        });
        setAddedBookmark(null);
      } else {
        // Add bookmarks for each content ID
        // eslint-disable-next-line no-lonely-if
        if (Array.isArray(contentId)) {
          for (const id of contentId) {
            await executeCreateBookmark({ contentId: id });
          }
        } else {
          await executeCreateBookmark({ contentId });
        }
      }
    } catch (err) {
      toast('Something went wrong');
    } finally {
      setIsDisabled(false);
    }
    return false;
  };

  return { addedBookmark, handleBookmark, isDisabled };
};
