import { Exhibit, Gallery } from 'src/domains/entities';
import {
  getActiveExhibits,
  getAllExhibits,
} from 'src/infra/firebase/CreatorRepo';
import {
  getGalleries,
  getGalleriesByIds,
} from 'src/infra/firebase/GalleryRepo';

export interface GalleryExhibits {
  gallery: Gallery;
  exhibits: Exhibit[];
}

const new_getGalleryExhibits = async (date: Date) => {
  const activeExhibits = await getActiveExhibits(date);
  const galleries = await getGalleriesByIds(
    activeExhibits.map(x => x.galleryId),
  );

  const groupedExhibits = Map.groupBy(activeExhibits, x => x.galleryId);
  return groupedExhibits
    .entries()
    .map<GalleryExhibits | null>(([galleryId, exhibits]) => {
      const gallery = galleries.find(x => x.id === galleryId);
      if (gallery === undefined) {
        return null;
      }

      return { gallery, exhibits };
    })
    .filter(x => x !== null)
    .toArray();
};

const legacy_getGalleryExhibits = async () => {
  const galleries = await getGalleries();
  const exhibits = await getAllExhibits();

  const groupedExhibits = Map.groupBy(exhibits, x => x.location);

  const array = Array.from(groupedExhibits.entries())
    .map(([key, value]) => {
      const gallery = galleries.find(x => x.name === key);
      if (gallery === undefined) return null;
      return {
        gallery: gallery,
        exhibits: value,
      };
    })
    .filter((x): x is GalleryExhibits => x !== null);

  return array;
};

/** ギャラリー情報と関連する展示の配列を取得 */
export const getGalleryExhibits = legacy_getGalleryExhibits;

// todo: 移行完了後、統廃合
void new_getGalleryExhibits;
