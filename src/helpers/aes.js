import CryptoJS from "crypto-js";

export const encryptData = data => {
  let secret = process.env.REACT_APP_SECRET;
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), secret);
  return cipher.toString();
};
