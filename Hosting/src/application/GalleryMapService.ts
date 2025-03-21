import { Exhibit, Gallery } from 'src/domain/entities';
import { getActiveExhibits } from 'src/infra/firebase/CreatorRepo';
import { galleryRepo } from 'src/infra/firebase/GalleryRepo';
import { GeocodingService } from 'src/domain/services/GeocodingService';
import { googleMapsGeocoder } from 'src/infra/gcp/GoogleMapsGeocoder';

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

const geocodingService = new GeocodingService(googleMapsGeocoder);

/** ギャラリー情報を追加 */
export const addGallery = async (data: Gallery): Promise<void> => {
  const latLng = await geocodingService.getLatLngFromAddress(data.location);
  await galleryRepo.addGallery(data, latLng);
};

/** ギャラリー情報の一覧を取得 */
export const getGalleries = async (): Promise<Gallery[]> =>
  await galleryRepo.getGalleries();
