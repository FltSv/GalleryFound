import { useCallback, useEffect, useRef, useState } from 'react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  MapEvent,
} from '@vis.gl/react-google-maps';
import { Env } from 'src/Env';
import {
  GalleryExhibits,
  getGalleryExhibits,
} from 'src/application/GalleryMapService';
import { ExpandableDisplay } from 'components/ExpandableDisplay';
import { Gallery } from 'src/domain/entities';

// 東京駅
const TOKYO_POS = {
  lat: 35.68152,
  lng: 139.766965,
} as const satisfies google.maps.LatLngLiteral;

const TODAY = new Date();

const createGoogleMapUrl = {
  search: (gallery: Gallery): string => {
    const query = encodeURIComponent(gallery.name);
    const placeIdQuery =
      (gallery.placeId?.length ?? 0) > 0
        ? `&query_place_id=${gallery.placeId}`
        : '';
    return `https://www.google.com/maps/search/?api=1&query=${query}${placeIdQuery}`;
  },

  directions: (gallery: Gallery): string => {
    const query = encodeURIComponent(gallery.name);
    const baseUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    const placeIdQuery =
      (gallery.placeId?.length ?? 0) > 0
        ? `&destination_place_id=${gallery.placeId}`
        : '';
    return `${baseUrl}${placeIdQuery}`;
  },
};

export const Map = () => {
  // 展示IDを取得
  const urlParams = new URLSearchParams(window.location.search);
  const exhibitId = urlParams.get('eid') ?? undefined;
  const skipGeolocation = exhibitId !== undefined;

  // 位置情報を取得
  const { coords, error, isLoading } = useGeolocation(skipGeolocation);

  // エラーポップアップの表示状態を管理
  const [showError, setShowError] = useState(true);
  const handleCloseError = useCallback(() => {
    setShowError(false);
  }, []);

  return (
    <div className="h-svh w-svw bg-white">
      <MapView coords={coords} exhibitId={exhibitId} />
      {!isLoading && error && showError && (
        <div
          className={`
            absolute bottom-0 left-0 m-4 flex items-center rounded bg-red-100/90
            px-3 py-1 shadow
          `}>
          <p>現在位置取得に失敗しました: {error.message}</p>
          <button
            aria-label="閉じる"
            className="ml-2 p-1"
            onClick={handleCloseError}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

interface MapViewProps {
  coords?: GeolocationCoordinates;
  exhibitId?: string;
}

const MapView = ({ coords, exhibitId }: MapViewProps) => {
  const [galleries, setGalleries] = useState<GalleryExhibits[]>([]);
  const [viewExhibit, setViewExhibit] = useState<GalleryExhibits | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    void (async () => {
      const galleries = await getGalleryExhibits(TODAY);
      if (exhibitId !== undefined) {
        // 一致するギャラリーを検索
        const gallery = galleries.find(x =>
          x.exhibits.find(x => x.id === exhibitId),
        );

        if (gallery !== undefined) {
          const viewGallery = {
            ...gallery,
            exhibits: gallery.exhibits.filter(x => exhibitId === x.id),
          };
          setViewExhibit(viewGallery);

          // centerPosが更新されたときに地図の中心を移動
          if (mapRef.current) {
            mapRef.current.setZoom(15);
            mapRef.current.panTo(gallery.gallery.latLng);
          }
          return;
        }
      }

      const conditionally = galleries
        .map(x => ({
          ...x,
          exhibits: x.exhibits.filter(ex => ex.endDate >= TODAY),
        }))
        .filter(x => x.exhibits.length > 0);
      setGalleries(conditionally);
    })();
  }, [exhibitId]);

  // 現在地
  const currPos: google.maps.LatLngLiteral | undefined = coords && {
    lat: coords.latitude,
    lng: coords.longitude,
  };

  // Map表示時の中央地点
  const centerPos = currPos ?? TOKYO_POS;

  const onTilesLoaded = useCallback((e: MapEvent) => {
    mapRef.current = e.map;
  }, []);

  return (
    <APIProvider apiKey={Env.MAPS_JS_API}>
      <GoogleMap
        defaultCenter={centerPos}
        defaultZoom={12}
        mapId="f63e2cf30554f3f8"
        onTilesLoaded={onTilesLoaded}>
        {currPos !== undefined && (
          <AdvancedMarker position={currPos}>
            <FaLocationCrosshairs className="text-3xl text-cyan-400" />
          </AdvancedMarker>
        )}
        {galleries.map(x => (
          <GalleryMarker item={x} key={x.gallery.id} />
        ))}
        {viewExhibit !== null && <GalleryMarker item={viewExhibit} show />}
      </GoogleMap>
    </APIProvider>
  );
};

interface GalleryMarkerProps {
  item: GalleryExhibits;
  show?: boolean;
}

const GalleryMarker = (props: GalleryMarkerProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    setShowInfo(props.show ?? false);
  }, [props.show]);

  const { gallery, exhibits } = props.item;

  const onMarkerClick = useCallback(() => {
    setShowInfo(isShown => !isShown);
  }, []);

  const onClose = useCallback(() => {
    setShowInfo(false);
  }, []);

  return (
    <AdvancedMarker
      key={gallery.id}
      onClick={onMarkerClick}
      position={gallery.latLng}
      ref={markerRef}>
      <Pin background="#ef4444" borderColor="#7f1d1d" glyphColor="#7f1d1d" />
      {showInfo && (
        <InfoWindow
          anchor={marker}
          headerContent={
            <p className="max-w-52 align-middle">
              <span className="text-base font-bold">{gallery.name}</span>
              {(gallery.operationType?.length ?? 0) > 0 && (
                <span
                  className={`
                    border-primary-500 text-primary-500 mx-2 h-fit w-fit
                    rounded-full border px-2 text-nowrap
                  `}>
                  {gallery.operationType}
                </span>
              )}
            </p>
          }
          onClose={onClose}>
          <div className="flex max-w-60 flex-col gap-2 pt-1">
            <p>{gallery.location}</p>
            {gallery.openingHours && <OpeningHoursDisplay gallery={gallery} />}
            {(gallery.artType?.length ?? 0) > 0 && (
              <div>
                <p className="font-medium">取扱作品:</p>
                <p className="text-xs">{gallery.artType}</p>
              </div>
            )}
            <div
              className={`
                *:bg-primary-500 *:w-full *:rounded-full *:py-2 *:text-center
                *:text-xs *:text-white
                flex gap-2
              `}>
              <a
                href={createGoogleMapUrl.search(gallery)}
                rel="noopener noreferrer"
                target="_blank">
                Mapで開く
              </a>
              <a
                href={createGoogleMapUrl.directions(gallery)}
                rel="noopener noreferrer"
                target="_blank">
                ここへの経路
              </a>
            </div>
            {exhibits.map(x => (
              <div className="flex gap-2 py-1" key={x.id}>
                <img className="inline w-16" src={x.imageUrl} />
                <div>
                  <p className="text-base font-bold">{x.title}</p>
                  <p>{x.getDatePeriod()}</p>
                </div>
              </div>
            ))}
            <p className="text-[0.5rem]">
              ※ 祝日は営業時間が異なる可能性があります。
            </p>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

/** 位置情報を取得 */
const useGeolocation = (skip: boolean = false) => {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState(!skip);

  useEffect(() => {
    if (skip) return;

    navigator.geolocation.getCurrentPosition(
      position => {
        setCoords(position.coords);
        setIsLoading(false);
      },
      err => {
        setError(err);
        setIsLoading(false);
      },
    );
  }, [skip]);

  return {
    coords: coords ?? undefined,
    error: error ?? undefined,
    isLoading,
  };
};

interface OpeningHoursDisplayProps {
  gallery: Gallery;
}

const OpeningHoursDisplay = ({ gallery }: OpeningHoursDisplayProps) => {
  // 今日の曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
  const todayIndex = TODAY.getDay();
  const descriptions = gallery.openingHours?.weekdayDescriptions ?? [];

  const collapsedContent = (
    <p className="text-xs">{descriptions[todayIndex]}</p>
  );

  const expandedContent = (
    <div>
      {descriptions.map((hours, i) => (
        <p className="text-xs" key={i}>
          {hours}
        </p>
      ))}
    </div>
  );

  return (
    <ExpandableDisplay
      collapsedContent={collapsedContent}
      expandedContent={expandedContent}
      title="営業時間:"
    />
  );
};
