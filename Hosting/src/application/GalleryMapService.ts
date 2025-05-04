import { Exhibit, Gallery } from 'src/domain/entities';
import { getActiveExhibits } from 'src/infra/firebase/CreatorRepo';
import { galleryRepo } from 'src/infra/firebase/GalleryRepo';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type GalleryData = Optional<Gallery, 'id'>;

/**
 * ギャラリーと展示情報を集約したDTO
 */
export interface GalleryExhibits {
  gallery: Gallery;
  exhibits: Exhibit[];
}

/** ギャラリー情報と関連する展示の配列を取得 */
export const getGalleryExhibits = async (date: Date) => {
  const activeExhibits = await getActiveExhibits(date);
  const galleries = await galleryRepo.getGalleriesByIds(
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

/** ギャラリー情報を取得 */
export const getGallery = async (
  galleryId: string,
): Promise<Gallery | undefined> => await galleryRepo.getGallery(galleryId);

/** placeIdに対応するギャラリー情報を取得 */
export const getGalleryByPlaceId = async (
  placeId: string,
): Promise<Gallery | undefined> =>
  await galleryRepo.getGalleryByPlaceId(placeId);

/** ギャラリー情報の追加・編集 */
export const updateGallery = async (data: GalleryData): Promise<Gallery> => {
  if (data.id === undefined || data.id.length === 0) {
    return await galleryRepo.addGallery(data);
  }

  const gallery = data as Gallery;
  await galleryRepo.updateGallery(gallery);

  return gallery;
};

/** ギャラリー情報の一覧を取得 */
export const getGalleries = async (): Promise<Gallery[]> =>
  await galleryRepo.getGalleries();
