import type { CartItem, DemoOrder, Restriction } from '../domain';

export type Route = 'home' | 'search' | 'favorites' | 'restaurant' | 'dish' |
  'cart' | 'profile' | 'edit' | 'note' | 'settings' | 'notifications' | 'chat' | 'buddy';

export type Notice = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type Message = {
  id: string;
  restaurantId: string;
  body: string;
  createdAt: string;
};

export type UserData = {
  name: string;
  restrictions: Restriction[];
  favorites: string[];
  cart: CartItem[];
  orders: DemoOrder[];
  notifications: Notice[];
  messages: Message[];
  buddy: { name: string; email: string } | null;
  colorBlind: boolean;
  voice: boolean;
};

export function emptyUserData(name = ''): UserData {
  return { name, restrictions: [], favorites: [], cart: [], orders: [],
    notifications: [], messages: [], buddy: null, colorBlind: false, voice: false };
}

export function localId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
