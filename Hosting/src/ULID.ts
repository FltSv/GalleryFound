import { ulid, decodeTime } from 'ulidx';

export const getUlid = () => ulid();

export const toDate = (ulid: string) => {
  const unixTime = decodeTime(ulid);
  return new Date(unixTime);
};
