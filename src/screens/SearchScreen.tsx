import { useCatalog } from '../state/CatalogContext';
import { Search as SearchIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput,View } from 'react-native';
import { filterRestaurants } from '../filtering';
import { Header,Section } from '../components/Primitives';
import { Body,Screen } from '../components/ui';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { RestaurantCard,styles } from './DiscoveryShared';

export function SearchScreen() {
  const { restaurants, dishes } = useCatalog();
  const { navigate, data } = useApp();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [dietary, setDietary] = useState(false);
  const results = filterRestaurants(restaurants, dishes, data.restrictions, { query, cuisine, maxPrice, dietary });
  return <Screen>
    <Header title="Search" onBack={() => navigate('home')} />
    <View style={styles.search}><SearchIcon color={colors.border} size={20} />
      <TextInput accessibilityLabel="Search restaurants" placeholder="Find a meal that fits..." value={query}
        onChangeText={setQuery} autoCorrect={false} style={styles.searchInput} placeholderTextColor={colors.border} />
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
      {['', ...new Set(restaurants.map((restaurant) => restaurant.cuisine))].map((value) => <Pressable key={value}
        accessibilityRole="radio" accessibilityState={{ checked: cuisine === value }} onPress={() => setCuisine(value)}
        style={{ padding: 12, borderRadius: 16, backgroundColor: cuisine === value ? colors.paleTeal : colors.tabs }}>
        <Text style={{ color: colors.text }}>{value || 'All cuisines'}</Text>
      </Pressable>)}
    </ScrollView>
    <View style={styles.sectionRow}><Body>No listed dietary conflicts</Body>
      <Switch accessibilityLabel="Filter by my dietary needs" value={dietary} disabled={!data.restrictions.length}
        onValueChange={setDietary} trackColor={{ true: colors.teal }} />
    </View>
    {!data.restrictions.length && <Body>Add dietary needs in Profile to use this filter.</Body>}
    <View style={styles.sectionRow}>{[null, 1000, 1500, 2000].map((value) => <Pressable key={String(value)}
      accessibilityRole="radio" accessibilityState={{ checked: maxPrice === value }} onPress={() => setMaxPrice(value)}
      style={{ padding: 10, borderRadius: 12, backgroundColor: maxPrice === value ? colors.paleTeal : colors.tabs }}>
      <Text>{value === null ? 'Any price' : `≤ $${value / 100}`}</Text>
    </Pressable>)}</View>
    <Pressable accessibilityRole="button" onPress={() => { setQuery(''); setCuisine(''); setMaxPrice(null); setDietary(false); }}><Text style={styles.seeAll}>Clear filters</Text></Pressable>
    <Section>Restaurants</Section>
    {!results.length && <Body>No restaurants match “{query}”. Try a name or cuisine.</Body>}
    <View style={styles.grid}>{results.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} grid />)}</View>
  </Screen>;
}
