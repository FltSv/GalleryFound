import { Geocoder } from 'src/domain/services/GeocodingService';

const getCoordinates: Geocoder['getCoordinates'] = async address => {
  const geocoder = new google.maps.Geocoder();
  const results = await new Promise<google.maps.GeocoderResult[]>(
    (resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK) {
          reject(new Error(status));
          return;
        }

        if (results === null || results.length === 0) {
          reject(new Error('結果が見つかりませんでした'));
          return;
        }

        resolve(results);
      });
    },
  );

  const latLng = results[0].geometry.location.toJSON();
  console.debug(`住所の位置情報を取得: "${address}": `, latLng);
  return latLng;
};

export const googleMapsGeocoder: Geocoder = {
  getCoordinates,
};
