import { OpeningHours } from 'src/domain/place';
import 'src/extensions/date.extensions';

/** 作家 */
export interface Creator {
  id: string;

  /** 表示名 */
  name: string;

  /** ジャンル */
  genre: string;

  /** プロフィール */
  profile: string;
  profileHashtags: string[];

  /** SNSリンク */
  links: string[];

  /** 代表作品ID */
  highlightProductId: string | null;

  /** 代表作品のサムネイルURL */
  highlightThumbUrl: string | null;

  /** 発表作品一覧 */
  products: Product[];

  /** 展示一覧 */
  exhibits: Exhibit[];
}

/** 発表作品 */
export interface Product extends ImageStatus {
  id: string;

  /** 作品名 */
  title: string;

  /** 代表作品か */
  isHighlight: boolean;

  /** 作品説明、他 */
  detail: string;

  /** 並び順 */
  order: number;

  /** 作品の作成日 */
  createdAt: Date;

  /** DBへの登録日 */
  addedAt: Date;
}

/** 展示 */
export interface Exhibit extends ImageStatus {
  id: string;

  /** 展示名 */
  title: string;

  /** 展示場所 */
  location: string;
  galleryId: string;

  /** 展示期間 */
  startDate: Date;
  endDate: Date;
  getDatePeriod: () => string;
}

export interface ImageStatus {
  /** 画像URL */
  imageUrl: string;

  /** サムネイルURL */
  thumbUrl: string;
}

/** ギャラリー情報 */
export interface Gallery {
  id: string;
  name: string;
  location: string;
  latLng: google.maps.LatLngLiteral;
  placeId?: string;

  /** 営業時間 */
  openingHours?: OpeningHours;

  /** 取扱作品 */
  artType?: string;

  /** 運営形態 */
  operationType?: string;
}

/** 日付の期間の表示値を返す */
export const getDatePeriod = (start: Date, end: Date) => {
  const startString = start.toDisplayDateString();
  const endString = end.toDisplayDateString();
  return `${startString} ～ ${endString}`;
};
