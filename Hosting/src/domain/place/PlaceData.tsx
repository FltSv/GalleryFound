import { OpeningHours } from 'src/domain/place';

export interface PlaceData {
  name: string;
  address: string;
  position: google.maps.LatLngLiteral;
  placeId: string;
  openingHours?: OpeningHours;
}
