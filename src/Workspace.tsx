import { ActivityIndicator, View } from 'react-native';
import type { AccountType } from './components/AccountTypeSelector';
import { restaurants, initialDishes } from './demo/menu';
import { useRestaurantData } from './restaurant/useRestaurantData';
import { RestaurantApp } from './RestaurantApp';
import { CatalogContext } from './state/CatalogContext';
import { useUserData } from './state/useUserData';
import { UserApp } from './UserApp';
import { colors } from './theme';

export function Workspace({ userId, mode, onSwitch, onExit }: {
  userId?: string; mode: AccountType; onSwitch: () => void; onExit: () => void;
}) {
  const user = useUserData(userId);
  const restaurant = useRestaurantData(userId);
  if (!restaurant.ready || !user.ready) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
    <ActivityIndicator color={colors.teal} />
  </View>;
  return <CatalogContext.Provider value={{
    restaurants: restaurants.map((item) => item.id === restaurant.data.profile.id ? restaurant.data.profile : item),
    dishes: [...initialDishes, ...restaurant.data.dishes],
  }}>
    {mode === 'restaurant' ? <RestaurantApp store={restaurant} user={user} onSwitch={onSwitch} onExit={onExit} />
      : <UserApp user={user} userId={userId} onSwitchMode={onSwitch} onExit={onExit} />}
  </CatalogContext.Provider>;
}
