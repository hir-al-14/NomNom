import { createContext, useContext } from 'react';
import type { useUserData } from '../state/useUserData';
import type { useRestaurantData } from './useRestaurantData';

export type OwnerRoute = 'profile' | 'editProfile' | 'dish' | 'chat' | 'thread' | 'scan' | 'orders' | 'settings';
export type OwnerContextValue = {
  store: ReturnType<typeof useRestaurantData>;
  user: ReturnType<typeof useUserData>;
  navigate: (route: OwnerRoute, id?: string) => void;
  dishId: string;
  onSwitch: () => void;
  onExit: () => void;
};
export const OwnerContext = createContext<OwnerContextValue | null>(null);
export function useOwner() {
  const context = useContext(OwnerContext);
  if (!context) throw new Error('Restaurant screen requires OwnerContext');
  return context;
}
