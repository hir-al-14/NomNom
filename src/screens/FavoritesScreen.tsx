import { useCatalog } from '../state/CatalogContext';
import { View } from 'react-native';
import { Header } from '../components/Primitives';
import { Body,Screen } from '../components/ui';
import { useApp } from '../state/AppContext';

import { RestaurantCard,styles } from './DiscoveryShared';

export function FavoritesScreen() {
  const { restaurants } = useCatalog();
  const { data, navigate } = useApp();
  const favorites = restaurants.filter((restaurant) => data.favorites.includes(restaurant.id));
  return <Screen>
    <Header title="Favorites" onBack={() => navigate('home')} />
    {!favorites.length && <Body>Tap a restaurant’s heart to save it here.</Body>}
    <View style={styles.grid}>{favorites.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} grid />)}</View>
  </Screen>;
}

