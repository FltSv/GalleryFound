import {
  ChangeEvent,
  useCallback,
  useState,
  KeyboardEvent,
  useEffect,
} from 'react';
import { Input, IconButton } from '@mui/joy';
import { FaSearch } from 'react-icons/fa';
import {
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { Spinner } from './Spinner';

// 東京駅
export const TOKYO_POS = {
  lat: 35.68152,
  lng: 139.766965,
} as const satisfies google.maps.LatLngLiteral;

export interface PlaceData {
  name: string;
  address: string;
  position: google.maps.LatLngLiteral;
  placeId: string;
}

export interface MapLocationPickerProps {
  initialLocation?: string;
  initialPosition?: google.maps.LatLngLiteral;
  onSelectLocation: (locationData: PlaceData) => void;
  onInitialLoad?: (locationData: PlaceData) => void;
}

export const MapLocationPicker = ({
  initialLocation,
  initialPosition,
  onSelectLocation,
  onInitialLoad,
}: MapLocationPickerProps) => {
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>(
    initialPosition || TOKYO_POS,
  );
  const [locationQuery, setLocationQuery] = useState(initialLocation ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');

  useEffect(() => {
    if (initialPosition) {
      setMarkerPos(initialPosition);
      map?.panTo(initialPosition);
    }
  }, [initialPosition, map]);

  // 共通の処理：位置情報から場所データを取得して返す
  const fetchLocationDetails = useCallback(
    async (
      position: google.maps.LatLngLiteral,
      placeId: string | null,
    ): Promise<PlaceData> => {
      setIsLoading(true);
      try {
        // placeIdが提供されている場合、Placeオブジェクトを使用
        if (
          typeof placeId === 'string' &&
          placeId.length > 0 &&
          placesLibrary
        ) {
          const place = new google.maps.places.Place({
            id: placeId,
            requestedLanguage: 'ja',
          });

          try {
            await place.fetchFields({
              fields: ['displayName', 'formattedAddress'],
            });

            const name = place.displayName ?? '不明な場所';
            const address = place.formattedAddress ?? '不明な場所';

            return {
              name,
              address,
              position,
              placeId,
            };
          } catch (error) {
            console.error('Place details fetch failed:', error);
            return {
              name: '不明な場所',
              address: '不明な場所',
              position,
              placeId,
            };
          }
        }

        // placeIdがない場合、Geocoderを使用
        return new Promise(resolve => {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: position }, async (results, status) => {
            if (
              status !== google.maps.GeocoderStatus.OK ||
              !results ||
              results.length === 0
            ) {
              console.error('Geocoder failed due to: ' + status);
              resolve({
                name: '不明な場所',
                address: '不明な場所',
                position,
                placeId: '',
              });
              return;
            }

            const result = results[0];
            const resultPlaceId = result.place_id;

            try {
              if (!placesLibrary) {
                resolve({
                  name: result.formatted_address,
                  address: result.formatted_address,
                  position,
                  placeId: resultPlaceId,
                });
                return;
              }

              const place = new google.maps.places.Place({
                id: resultPlaceId,
                requestedLanguage: 'ja',
              });

              await place.fetchFields({
                fields: ['displayName'],
              });

              resolve({
                name: place.displayName ?? '不明な場所',
                address: result.formatted_address,
                position,
                placeId: resultPlaceId,
              });
            } catch (error) {
              console.error('Place details fetch failed:', error);
              resolve({
                name: '不明な場所',
                address: result.formatted_address || '不明な場所',
                position,
                placeId: resultPlaceId,
              });
            }
          });
        });
      } finally {
        setIsLoading(false);
      }
    },
    [placesLibrary],
  );

  // 初回読込完了時の処理
  useEffect(() => {
    const loadInitialLocationData = async () => {
      if (!map || !onInitialLoad) return;

      setIsLoading(true);
      try {
        const locationData = await fetchLocationDetails(markerPos, null);
        onInitialLoad(locationData);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialLocationData();
  }, [map, onInitialLoad, markerPos, fetchLocationDetails]);

  // マップクリック時の処理
  const handleMapClick = useCallback(
    async (e: MapMouseEvent) => {
      if (!e.detail.latLng) return;

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPosition = e.detail.latLng;
      setMarkerPos(newPosition);

      const locationData = await fetchLocationDetails(
        newPosition,
        e.detail.placeId,
      );
      onSelectLocation(locationData);
      setIsLoading(false);
    },
    [onSelectLocation, fetchLocationDetails],
  );

  // 場所検索の処理
  const handleSearchLocation = useCallback(async () => {
    if (!placesLibrary) {
      console.error('Places library not loaded');
      return;
    }

    if (!map) {
      console.error('Map instance not available');
      return;
    }

    if (!locationQuery) {
      console.error('Location query is empty');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const searchResults = await searchPlacesByText(locationQuery, map);

      if (searchResults.length === 0) {
        console.error('No places found for the query:', locationQuery);
        setIsLoading(false);
        return;
      }

      const placeData = searchResults[0];

      if (!placeData.location) {
        console.error('Place location not found:', placeData);
        setIsLoading(false);
        return;
      }

      const newPosition = placeData.location.toJSON();
      setMarkerPos(newPosition);

      // 検索結果の位置にマップの中央を移動
      map.panTo(newPosition);
      const placeId = placeData.id;

      // 必要な情報が既に存在する場合
      const hasAddress =
        typeof placeData.formattedAddress === 'string' &&
        placeData.formattedAddress !== '';
      const hasName =
        typeof placeData.displayName === 'string' &&
        placeData.displayName !== '';

      if (hasAddress && hasName) {
        setIsLoading(false);
        onSelectLocation({
          name: placeData.displayName!,
          address: placeData.formattedAddress!,
          position: newPosition,
          placeId,
        });
        return;
      }

      // 追加情報が必要な場合は共通処理を使用
      const locationData = await fetchLocationDetails(newPosition, placeId);
      onSelectLocation(locationData);
    } catch (error) {
      setIsLoading(false);
      console.error('Place search request failed:', error);
    }
  }, [
    placesLibrary,
    map,
    locationQuery,
    onSelectLocation,
    fetchLocationDetails,
  ]);

  // テキスト検索を実行する関数
  const searchPlacesByText = async (
    query: string,
    map: google.maps.Map,
  ): Promise<google.maps.places.Place[]> => {
    const request: google.maps.places.SearchByTextRequest = {
      textQuery: query,
      fields: ['displayName', 'location', 'id', 'formattedAddress'],
      language: 'ja',
      region: 'jp',
      locationBias: map.getBounds(),
    };

    const { places } = await google.maps.places.Place.searchByText(request);
    return places;
  };

  const handleLocationQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLocationQuery(e.target.value);
    },
    [],
  );

  const canSearch =
    !isLoading && locationQuery !== '' && placesLibrary !== null;

  // Enterキーでの検索実行
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') {
        return;
      }

      // デフォルトのフォームsubmitを防止
      event.preventDefault();

      // 検索可能な場合のみ実行
      if (canSearch) {
        handleSearchLocation();
      }
    },
    [handleSearchLocation, canSearch],
  );

  return (
    <div
      className={`
        flex flex-col gap-2
        md:min-w-xs
      `}>
      <div className="flex gap-1">
        <Input
          endDecorator={
            <IconButton
              aria-label="検索"
              color="neutral"
              disabled={!canSearch}
              onClick={handleSearchLocation}
              size="sm"
              variant="plain">
              <FaSearch />
            </IconButton>
          }
          onChange={handleLocationQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="場所の名前や住所を検索..."
          sx={{ borderColor: 'black', flexGrow: 1 }}
          value={locationQuery}
        />
      </div>

      <div className="relative h-80">
        {isLoading && (
          <div
            className={`
              absolute inset-0 z-10 flex items-center justify-center bg-white/60
            `}>
            <Spinner />
          </div>
        )}

        <GoogleMap
          clickableIcons={false}
          defaultCenter={markerPos}
          defaultZoom={15}
          disableDefaultUI
          gestureHandling="greedy"
          mapId="f63e2cf30554f3f8"
          onClick={handleMapClick}>
          <AdvancedMarker position={markerPos}>
            <Pin />
          </AdvancedMarker>
        </GoogleMap>
      </div>
    </div>
  );
};
