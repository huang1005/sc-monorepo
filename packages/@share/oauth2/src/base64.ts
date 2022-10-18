import CryptoJS from 'crypto-js';

export function base64UrlEncode(str) {
  return str
    .toString(CryptoJS.enc.Base64)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
