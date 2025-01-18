import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
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
  getDatePeriodString,
  getGalleryExhibits,
} from 'src/Data';

// 東京駅
const TOKYO_POS = {
  lat: 35.68152,
  lng: 139.766965,
} as const satisfies google.maps.LatLngLiteral;

const TODAY = new Date();

export const Map = () => {
  const renderErrorView = useCallback(
    (error: GeolocationPositionError) => <MapView error={error} />,
    [],
  );

  const renderProcessView = useCallback(() => <p>現在位置取得中…</p>, []);

  const renderSuccessView = useCallback(
    (coords: GeolocationCoordinates) => <MapView coords={coords} />,
    [],
  );

  return (
    <div className="h-svh w-svw bg-white">
      <GeolocationWrapper
        renderErrorView={renderErrorView}
        renderProcessView={renderProcessView}
        renderSuccessView={renderSuccessView}
      />
    </div>
  );
};

interface MapViewProps {
  coords?: GeolocationCoordinates;
  error?: GeolocationPositionError;
}

const MapView = ({ coords, error }: MapViewProps) => {
  const [galleries, setGalleries] = useState<GalleryExhibits[]>([]);
  const [viewExhibit, setViewExhibit] = useState<GalleryExhibits | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const exhibitId = urlParams.get('eid');

  useEffect(() => {
    void (async () => {
      const galleries = await getGalleryExhibits();
      if (exhibitId !== null) {
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
      {error !== undefined && (
        <p className="bg-red-100 p-1">
          現在位置取得に失敗しました: {error.message}
        </p>
      )}
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
            <div>
              <p className="text-base">{gallery.name}</p>
              <p className="max-w-60">{gallery.location}</p>
            </div>
          }
          onClose={onClose}>
          {exhibits.map(x => (
            <div className="flex gap-2 py-1" key={x.id}>
              <img className="inline w-16" src={x.imageUrl} />
              <div>
                <p className="text-base font-bold">{x.title}</p>
                <p>{getDatePeriodString(x.startDate, x.endDate)}</p>
              </div>
            </div>
          ))}
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

interface WrapperProps {
  renderProcessView: () => ReactNode;
  renderSuccessView: (coords: GeolocationCoordinates) => ReactNode;
  renderErrorView: (error: GeolocationPositionError) => ReactNode;
}

const GeolocationWrapper = (props: WrapperProps) => {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCoords(coords);
    }, setError);
  }, []);

  return (
    <>
      {useMemo(() => {
        if (coords === null) return;
        return props.renderSuccessView(coords);
      }, [coords, props])}

      {useMemo(() => {
        if (error === null) return;
        return props.renderErrorView(error);
      }, [error, props])}

      {useMemo(() => {
        if (!(error === null && coords === null)) return;
        return props.renderProcessView();
      }, [coords, error, props])}
    </>
  );
};
