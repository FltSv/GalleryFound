import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { Gallery, getGalleries } from 'src/Data';

// 東京駅
const TOKYO_POS = {
  lat: 35.68152,
  lng: 139.766965,
} as const satisfies google.maps.LatLngLiteral;

export const Map = () => (
  <div className="h-svh w-svw bg-white">
    <GeolocationWrapper
      renderProcessView={() => <p>現在位置取得中…</p>}
      renderSuccessView={coords => <MapView coords={coords} />}
      renderErrorView={error => <MapView error={error} />}
    />
  </div>
);

interface MapViewProps {
  coords?: GeolocationCoordinates;
  error?: GeolocationPositionError;
}

const MapView = ({ coords, error }: MapViewProps) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    void (async () => {
      const galleries = await getGalleries();
      setGalleries(galleries);
    })();
  }, []);

  // 現在地
  const currPos: google.maps.LatLngLiteral | undefined = coords && {
    lat: coords.latitude,
    lng: coords.longitude,
  };

  // Map表示時の中央地点
  const centerPos = currPos ?? TOKYO_POS;

  return (
    <APIProvider apiKey={process.env.MAPS_JS_API ?? ''}>
      {error !== undefined && (
        <p className="bg-red-100 p-1">
          現在位置取得に失敗しました: {error.message}
        </p>
      )}
      <GoogleMap
        mapId="f63e2cf30554f3f8"
        defaultCenter={centerPos}
        defaultZoom={12}>
        {currPos !== undefined && (
          <AdvancedMarker position={currPos}>
            <FaLocationCrosshairs className="text-3xl text-cyan-400" />
          </AdvancedMarker>
        )}
        {galleries.map(x => (
          <GalleryMarker key={x.id} gallery={x} />
        ))}
      </GoogleMap>
    </APIProvider>
  );
};

const GalleryMarker = ({ gallery }: { gallery: Gallery }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const onMarkerClick = useCallback(() => {
    setShowInfo(isShown => !isShown);
  }, []);

  const onClose = useCallback(() => {
    setShowInfo(false);
  }, []);

  return (
    <AdvancedMarker
      ref={markerRef}
      key={gallery.id}
      position={gallery.latLng}
      onClick={onMarkerClick}>
      <Pin
        background={'#ef4444'}
        glyphColor={'#7f1d1d'}
        borderColor={'#7f1d1d'}
      />
      {showInfo && (
        <InfoWindow anchor={marker} onClose={onClose}>
          <h2>{gallery.name}</h2>
          <p>{gallery.location}</p>
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
