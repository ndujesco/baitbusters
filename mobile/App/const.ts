import { Dimensions, Platform, ToastAndroid } from "react-native";

export const GATEWAY_NUMBER = '07041556156';

export type Log = {
  id: string;
  source: string;
  from?: string | null;
  packageName?: string;
  body: string;
  spamStatus: number;
  receivedAt: number;
};

export const STORAGE_KEY = 'APP_LOGS_STORAGE_V1';

export const normalizePhone = (num: string) => {
  let n = num.replace(/[^\d]/g, '');
  if (n.startsWith('234')) n = '0' + n.slice(3);
  return n;
};


export function safeJsonParse(input: string | null | undefined) {
  if (!input) return null;
  try {
    const sanitized = input.replace(/[\u0000-\u001F]+/g, '');
    return JSON.parse(sanitized);
  } catch {
    return null;
  }
}

export const showToast = (msg: string) => {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else console.log('toast:', msg);
};

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const ACCENT = '#0f766e'; // polished teal (swap if you prefer)
 
export const BACKGROUND = '#F8FAFC'