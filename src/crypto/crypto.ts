import { createCipheriv, createDecipheriv } from "crypto";
import { GENERIC_KEY, CBC_KEY, CBC_IV } from "../helpers/contants";

export const decryptGenericData = (input: string, key: string = GENERIC_KEY): string | undefined => {
  try {
    const aes = createDecipheriv("aes-128-ecb", key, "");
    let decrypted = aes.update(input, 'base64', 'utf8');
    decrypted += aes.final();
    return decrypted;
  } catch(err) {
      return undefined;
  }  
}

export const decryptCbcData = (input: string): string | undefined => {
  try {
    const aes = createDecipheriv("aes-128-ecb", CBC_KEY, CBC_IV);
    let decrypted = aes.update(input, 'base64', 'utf8');
    decrypted += aes.final();
    return decrypted;
  } catch(err) {
      return undefined;
  }
}

export const encryptGenericData = (input: string, key: string = GENERIC_KEY): string => {
  const aes = createCipheriv("aes-128-ecb", key, "");
  const str = aes.update(input, "utf8", "base64");
  return str + aes.final("base64");
}

export const encryptCBCData = (input: string): string => {
  const aes = createCipheriv("aes-128-ecb", CBC_KEY, CBC_IV);
  const str = aes.update(input, "utf8", "base64");
  return str + aes.final("base64");
}