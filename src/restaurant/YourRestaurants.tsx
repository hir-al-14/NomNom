import { ArrowRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { RestaurantPhoto } from '../components/RestaurantPhoto';
import { Header } from '../components/Primitives';
import { Action, Body, Screen } from '../components/ui';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function YourRestaurants() {
  const { store, navigate, onSwitch, onExit } = useOwner();
  const restaurants = store.cloud ? store.choices : [store.data.profile];
  return <Screen>
    <Header title="Your restaurants" onBack={onSwitch} />
    <Body>Which restaurant would you like to manage?</Body>
    {restaurants.map((restaurant) => <Pressable key={restaurant.id} accessibilityRole="button"
      onPress={() => { store.selectRestaurant(restaurant.id); navigate('profile'); }} style={s.menuRow}>
      <RestaurantPhoto restaurant={restaurant} width={88} height={88} />
      <View style={{ flex: 1 }}><Text style={s.menuName}>{restaurant.name}</Text><Body>{restaurant.cuisine}</Body></View>
      <ArrowRight size={20} color="#0A2533" />
    </Pressable>)}
    {!restaurants.length && <Action label="Set up your restaurant" onPress={() => navigate('editProfile')} />}
    <Action label="Switch to personal mode" onPress={onSwitch} />
    <Action label="Log out" onPress={onExit} />
  </Screen>;
}
