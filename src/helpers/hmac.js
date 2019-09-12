import CryptoJS from "crypto-js";

export const getDigest = (method, path) => {
  let secret = process.env.REACT_APP_SECRET;
  let thisMinute = new Date().toISOString().slice(0, 16);
  return CryptoJS.HmacSHA512(thisMinute + method + path, secret).toString();
};
