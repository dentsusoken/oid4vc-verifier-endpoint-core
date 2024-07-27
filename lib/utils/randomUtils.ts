import { base64url } from 'jose';

export const randomUint8Array = (byteLength = 32): Uint8Array => {
  const buf = new Uint8Array(byteLength);
  crypto.getRandomValues(buf);
  return buf;
};

export const randomBase64URL = (byteLength: number = 32): string => {
  return base64url.encode(randomUint8Array(byteLength));
};
