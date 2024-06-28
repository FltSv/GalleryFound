import { ulid, decodeTime } from 'ulidx';

export function getUlid() {
  return ulid();
}

export function toDate(ulid: string) {
  const unixTime = decodeTime(ulid);
  return new Date(unixTime);
}
