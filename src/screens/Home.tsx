import { useCatalog } from '../state/CatalogContext';
import { Search as SearchIcon,ShoppingCart,Sun } from 'lucide-react-native';
import { Pressable,ScrollView,Text,View } from 'react-native';
import { IconButton,Section } from '../components/Primitives';
import { Body,Screen } from '../components/ui';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { RestaurantCard,styles } from './DiscoveryShared';

export function Home() {
  const { restaurants } = useCatalog();
  const { data, navigate } = useApp();
  const quantity = data.cart.reduce((sum, item) => sum + item.quantity, 0);
  return <Screen>
    <View style={styles.greeting}>
      <View style={{ flex: 1 }}>
        <View style={styles.inline}><Sun size={18} color={colors.border} /><Text style={styles.small}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}</Text></View>
        <Text style={styles.title}>{data.name || 'Welcome to NomNom'}</Text>
      </View>
      <IconButton Icon={ShoppingCart} label={`Cart, ${quantity} items`} onPress={() => navigate('cart')} />
    </View>
    <Pressable accessibilityRole="button" onPress={() => navigate('search')} style={styles.search}>
      <SearchIcon size={20} color={colors.border} /><Text style={styles.placeholder}>Find a meal that fits...</Text>
    </Pressable>
    {!data.restrictions.length && <Pressable accessibilityRole="button" onPress={() => navigate('profile')}>
      <Text style={styles.prompt}>Add dietary needs in Profile to personalize your meals →</Text>
    </Pressable>}
    <View style={styles.sectionRow}><Section>Restaurants</Section>
      <Pressable accessibilityRole="button" onPress={() => navigate('search')}><Text style={styles.seeAll}>Search & filter</Text></Pressable>
    </View>
    {[restaurants.filter((_, index) => index % 2 === 0), restaurants.filter((_, index) => index % 2 === 1)].filter((row) => row.length).map((row, index) =>
      <ScrollView key={index} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {row.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
      </ScrollView>)}
    {!restaurants.length && <Body>No restaurant menus yet. Add your restaurant in restaurant mode.</Body>}
  </Screen>;
}
