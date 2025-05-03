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
import { OpeningHours, PlaceData } from 'src/domain/place';

// 東京駅
export const TOKYO_POS = {
  lat: 35.68152,
  lng: 139.766965,
} as const satisfies google.maps.LatLngLiteral;

type PlaceFields = (keyof google.maps.places.Place)[];

/** PlaceIDからPlaceオブジェクトを取得する */
const getPlaceById = async (placeId: string) => {
  const place = new google.maps.places.Place({
    id: placeId,
    requestedLanguage: 'ja',
  });

  const fields: PlaceFields = [
    'displayName',
    'formattedAddress',
    'location',
    'regularOpeningHours',
  ];

  await place.fetchFields({ fields });
  return place;
};

/** テキスト検索を実行する */
const searchPlacesByText = async (
  query: string,
  map: google.maps.Map,
): Promise<google.maps.places.Place[]> => {
  const fields: PlaceFields = [
    'displayName',
    'formattedAddress',
    'id',
    'location',
    'regularOpeningHours',
  ];

  const request: google.maps.places.SearchByTextRequest = {
    textQuery: query,
    fields: fields,
    language: 'ja',
    region: 'jp',
    locationBias: map.getBounds(),
  };

  const { places } = await google.maps.places.Place.searchByText(request);
  return places;
};

/** テキスト検索を実行してPlaceDataを取得する */
const getPlaceDataByText = async (query: string, map: google.maps.Map) => {
  const searchResults = await searchPlacesByText(query, map);

  if (searchResults.length === 0) {
    throw new Error(`No places found for the query: ${query}`);
  }

  const placeData = searchResults[0];
  return getPlaceDataFromGooglePlace(placeData);
};

// 位置情報からPlaceIdを取得
const fetchPlaceIdByLatLng = async (
  position: google.maps.LatLngLiteral,
): Promise<string> =>
  new Promise(resolve => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: position }, async (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        throw new Error('Geocoder failed due to: ' + status);
      }

      if (results === null) {
        throw new Error('Geocoder failed: results is null');
      }

      if (results.length === 0) {
        throw new Error('Geocoder failed: no results found');
      }

      const result = results[0];
      resolve(result.place_id);
    });
  });

/** GooglePlaceオブジェクトからPlaceDataオブジェクトを生成する */
const getPlaceDataFromGooglePlace = (
  place: google.maps.places.Place,
): PlaceData => ({
  name: place.displayName ?? '不明な場所',
  address: place.formattedAddress ?? '不明な場所',
  position: place.location?.toJSON() ?? TOKYO_POS,
  placeId: place.id,
  openingHours: OpeningHours.fromGooglePlaces(place.regularOpeningHours),
});

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
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');

  useEffect(() => {
    if (initialPosition) {
      setMarkerPos(initialPosition);
      map?.panTo(initialPosition);
    }
  }, [initialPosition, map]);

  // 初回読込完了時の処理
  useEffect(() => {
    if (
      isInitialLoaded ||
      markerPos === TOKYO_POS ||
      map === null ||
      onInitialLoad === undefined ||
      locationQuery === ''
    ) {
      return;
    }

    const loadInitialLocationData = async () => {
      setIsLoading(true);

      try {
        const placeData = await getPlaceDataByText(locationQuery, map);
        onInitialLoad(placeData);
      } finally {
        setIsInitialLoaded(true);
        setIsLoading(false);
      }
    };

    loadInitialLocationData();
  }, [map, onInitialLoad, markerPos, isInitialLoaded, locationQuery]);

  // マップクリック時の処理
  const handleMapClick = useCallback(
    async (e: MapMouseEvent) => {
      if (!e.detail.latLng) return;

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPosition = e.detail.latLng;
      setMarkerPos(newPosition);

      if (map === null) {
        console.error('Map instance not available');
        return;
      }

      if (placesLibrary === null) {
        console.error('Places library not loaded');
        return;
      }

      try {
        const placeId =
          e.detail.placeId ?? (await fetchPlaceIdByLatLng(newPosition));

        const place = await getPlaceById(placeId);
        const placeData = getPlaceDataFromGooglePlace(place);
        onSelectLocation(placeData);
        return;
      } catch (error) {
        console.error('Place search request failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [map, onSelectLocation, placesLibrary],
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
      const placeData = await getPlaceDataByText(locationQuery, map);

      const newPosition = placeData.position;
      setMarkerPos(newPosition);

      // 検索結果の位置にマップの中央を移動
      map.panTo(newPosition);

      onSelectLocation(placeData);
    } catch (error) {
      console.error('Place search request failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [placesLibrary, map, locationQuery, onSelectLocation]);

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
