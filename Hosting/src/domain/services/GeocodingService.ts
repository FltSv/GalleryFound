export type LatLng = google.maps.LatLngLiteral;

export interface Geocoder {
  /** 住所から緯度経度を取得する */
  getCoordinates: (address: string) => Promise<LatLng>;
}

export class GeocodingService {
  constructor(private geocoder: Geocoder) {}

  async getLatLngFromAddress(address: string): Promise<LatLng> {
    try {
      return await this.geocoder.getCoordinates(address);
    } catch (error) {
      console.error(`位置情報の取得に失敗しました: "${address}"`, error);
      throw new Error(`住所から座標を取得できませんでした: ${address}`);
    }
  }
}
