import { ActivityIndicator, Text, View } from 'react-native';
import type { AccountType } from './components/AccountTypeSelector';
import { restaurants, initialDishes } from './demo/menu';
import { useRestaurantData } from './restaurant/useRestaurantData';
import { RestaurantApp } from './RestaurantApp';
import { CatalogContext } from './state/CatalogContext';
import { useUserData } from './state/useUserData';
import { UserApp } from './UserApp';
import { colors } from './theme';
import { useCatalogData } from './state/useCatalogData';
import { restaurantSeed } from './restaurant/seed';

export function Workspace({ userId, mode, onSwitch, onExit }: {
  userId?: string; mode: AccountType; onSwitch: () => void; onExit: () => void;
}) {
  const user = useUserData(userId);
  const restaurant = useRestaurantData(userId);
  const remote = useCatalogData(userId, restaurant.data);
  const demo = userId ? restaurantSeed() : restaurant.data;
  if (!restaurant.ready || !user.ready) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
    <ActivityIndicator color={colors.teal} />
  </View>;
  return <CatalogContext.Provider value={{
    restaurants: [...restaurants.map((item) => item.id === demo.profile.id ? demo.profile : item), ...remote.restaurants],
    dishes: [...initialDishes, ...demo.dishes, ...remote.dishes],
  }}>
    <View style={{ flex: 1 }}>
      {!!remote.error && mode === 'personal' && <Text style={{ padding: 24, color: '#A3343B' }}>{remote.error}</Text>}
      {mode === 'restaurant' ? <RestaurantApp store={restaurant} user={user} onSwitch={onSwitch} onExit={onExit} />
        : <UserApp user={user} userId={userId} onSwitchMode={onSwitch} onExit={onExit} />}
    </View>
  </CatalogContext.Provider>;
}
