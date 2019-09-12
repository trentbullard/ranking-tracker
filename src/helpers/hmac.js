import CryptoJS from "crypto-js";

export const getDigest = () => {
  let secret = process.env.REACT_APP_SECRET;
  let thisMinute = new Date().toISOString().slice(0, 16);
  return CryptoJS.HmacSHA512(thisMinute, secret).toString();
};
