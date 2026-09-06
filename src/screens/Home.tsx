import { Bell,ChevronRight,MessageCircle,Search as SearchIcon,ShoppingCart,Sun } from 'lucide-react-native';
import { Pressable,ScrollView,Text,View } from 'react-native';
import { IconButton,Section } from '../components/Primitives';
import { Body,Screen } from '../components/ui';
import { restaurants } from '../demo/menu';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { RestaurantCard,styles } from './DiscoveryShared';

export function Home() {
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
    <View style={styles.sectionRow}><Section>Top recommendations</Section>
      <Pressable accessibilityRole="button" onPress={() => navigate('search')}><Text style={styles.seeAll}>See all</Text></Pressable>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
    </ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {[...restaurants].reverse().map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
    </ScrollView>
    <Section>Your cart</Section>
    <Pressable accessibilityRole="button" onPress={() => navigate('cart')} style={styles.activity}>
      <ShoppingCart size={24} color={colors.text} />
      <Text style={styles.activityText}>{quantity ? `${quantity} ${quantity === 1 ? 'item' : 'items'} ready to review` : 'Your next meal starts here'}</Text>
      <ChevronRight size={24} color={colors.primary} />
    </Pressable>
    <View style={styles.sectionRow}>
      <IconButton Icon={MessageCircle} label="Messages" onPress={() => navigate('chat')} />
      <Body>Sample restaurant catalog</Body>
      <IconButton Icon={Bell} label="Notifications" onPress={() => navigate('notifications')} />
    </View>
  </Screen>;
}

