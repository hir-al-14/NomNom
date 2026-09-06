import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';
import type { Restriction } from '../domain';
import type { Route, UserData } from './types';

export type AppContextValue = {
  data: UserData;
  update: Dispatch<SetStateAction<UserData>>;
  navigate: (route: Route, id?: string) => void;
  restaurantId: string;
  dishId: string;
  saveProfile: (name: string, restrictions: Restriction[]) => Promise<void>;
  addToCart: (dishId: string) => void;
  onExit: () => void;
  onSwitchMode: () => void;
  signedIn: boolean;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('User screens require AppContext');
  return value;
}
