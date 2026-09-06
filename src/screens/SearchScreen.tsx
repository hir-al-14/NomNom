import { Search as SearchIcon } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput,View } from 'react-native';
import { Header,Section } from '../components/Primitives';
import { Body,Screen } from '../components/ui';
import { restaurants } from '../demo/menu';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { RestaurantCard,styles } from './DiscoveryShared';

export function SearchScreen() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');
  const results = restaurants.filter((restaurant) => `${restaurant.name} ${restaurant.cuisine}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <Screen>
    <Header title="Search" onBack={() => navigate('home')} />
    <View style={styles.search}><SearchIcon color={colors.border} size={20} />
      <TextInput accessibilityLabel="Search restaurants" placeholder="Find a meal that fits..." value={query}
        onChangeText={setQuery} autoCorrect={false} style={styles.searchInput} placeholderTextColor={colors.border} />
    </View>
    <Section>Restaurants</Section>
    {!results.length && <Body>No restaurants match “{query}”. Try a name or cuisine.</Body>}
    <View style={styles.grid}>{results.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} grid />)}</View>
  </Screen>;
}

