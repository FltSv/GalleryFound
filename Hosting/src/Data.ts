/** 住所から緯度経度を取得する */
export const getLatLngFromAddress = async (address: string) => {
  const geocoder = new google.maps.Geocoder();
  const geocodingTask = new Promise<google.maps.GeocoderResult[]>(
    (resolve, reject) =>
      void geocoder.geocode({ address: address }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK) {
          reject(new Error(status));
        }

        if (results !== null) {
          resolve(results);
        }

        reject(new Error('result is null'));
      }),
  );

  const results = await geocodingTask;

  console.debug(
    `get geocode: "${address}": `,
    results[0].geometry.location.toJSON(),
  );

  return results[0].geometry.location.toJSON();
};

/** 日付の期間の表示値を返す */
export const getDatePeriodString = (start: Date, end: Date) => {
  const startString = start.toLocaleDateString();
  const endString = end.toLocaleDateString();
  return `${startString} ～ ${endString}`;
};
