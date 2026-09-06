import type { UserData } from '../state/types';
export function preferences(data: UserData) {
  return { favorites: data.favorites, cart: data.cart, buddy: data.buddy, color_blind: data.colorBlind, voice: data.voice };
}
export function applyPreferences(row: any): Partial<UserData> {
  return row ? { favorites: row.favorites, cart: row.cart, buddy: row.buddy, colorBlind: row.color_blind, voice: row.voice } : {};
}
