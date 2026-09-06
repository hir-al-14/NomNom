import { useCatalog } from './state/CatalogContext';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { BottomNav, type Tab } from './components/BottomNav';
import { FloatingActions } from './components/FloatingActions';
import { FoodLookup } from './screens/FoodLookup';
import { matchDish } from './matching';
import { AppContext } from './state/AppContext';
import { useUserData } from './state/useUserData';
import type { Route } from './state/types';
import { Home } from './screens/Home';
import { SearchScreen } from './screens/SearchScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { RestaurantScreen } from './screens/RestaurantScreen';
import { MealDetail } from './screens/MealDetail';
import { Cart } from './screens/Cart';
import { Profile } from './screens/Profile';
import { EditProfile } from './screens/EditProfile';
import { FoodNote } from './screens/FoodNote';
import { Settings } from './screens/Settings';
import { CareBuddy } from './screens/CareBuddy';
import { Notifications } from './screens/Notifications';
import { Chat } from './screens/Chat';
import { colors, typography } from './theme';

type Props = { userId?: string; user: ReturnType<typeof useUserData>; onExit: () => void; onSwitchMode: () => void };

export function UserApp({ userId, user, onExit, onSwitchMode }: Props) {
  const { dishes: initialDishes } = useCatalog();
  const { data, update, ready, error, saveProfile } = user;
  const [route, setRoute] = useState<Route>('home');
  const [restaurantId, setRestaurantId] = useState('demo-kitchen');
  const [dishId, setDishId] = useState(initialDishes[0]?.id ?? '');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  useEffect(() => {
    Speech.stop();
    if (data.voice) Speech.speak(`NomNom. ${route === 'edit' ? 'Edit profile and dietary restrictions' : route}.`, { rate: 0.9 });
    return () => { Speech.stop(); };
  }, [route, data.voice]);

  function navigate(next: Route, id?: string) {
    Keyboard.dismiss();
    if (next === 'chat' && !id) setRestaurantId('');
    if (id && (next === 'restaurant' || next === 'chat')) setRestaurantId(id);
    if (id && next === 'dish') {
      setDishId(id);
      const dish = initialDishes.find((item) => item.id === id);
      if (dish) setRestaurantId(dish.restaurantId);
    }
    setRoute(next);
  }

  function addToCart(id: string) {
    const dish = initialDishes.find((item) => item.id === id);
    if (!dish || (dish.source && dish.source !== 'manual')) return;
    const add = () => {
      update((current) => {
        const existing = current.cart.find((item) => item.dishId === id);
        return { ...current, cart: existing
          ? current.cart.map((item) => item.dishId === id ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item)
          : [...current.cart, { dishId: id, quantity: 1 }] };
      });
      Alert.alert('Added to cart', dish.name, [
        { text: 'Keep browsing' }, { text: 'View cart', onPress: () => navigate('cart') },
      ]);
    };
    const match = matchDish(dish, data.restrictions);
    if (match.status === 'conflict' || match.status === 'unknown') {
      Alert.alert(match.label, 'Check this dish’s dietary details before adding it.', [
        { text: 'Review dish', onPress: () => navigate('dish', id) },
        { text: 'Cancel', style: 'cancel' }, { text: 'Add anyway', onPress: add },
      ]);
    } else add();
  }

  if (!ready) return <View style={styles.loading}><ActivityIndicator color={colors.teal} /><Text style={styles.message}>Opening NomNom…</Text></View>;
  const selected: Tab = ['edit', 'settings', 'buddy'].includes(route) ? 'profile'
    : ['restaurant', 'dish'].includes(route) ? 'search'
      : ['home', 'search', 'favorites', 'profile', 'note'].includes(route) ? route as Tab : 'home';
  const screens = {
    home: <Home />, search: <SearchScreen />, favorites: <FavoritesScreen />,
    restaurant: <RestaurantScreen />, dish: <MealDetail />, cart: <Cart />,
    profile: <Profile />, edit: <EditProfile />, note: <FoodNote />, settings: <Settings />,
    notifications: <Notifications />, chat: <Chat />, buddy: <CareBuddy />, lookup: <FoodLookup />,
  };
  return <AppContext.Provider value={{ data, update, navigate, restaurantId, dishId,
    saveProfile, addToCart, onExit, onSwitchMode, signedIn: !!userId,
    sendMessage: user.sendMessage, placeOrder: user.placeOrder }}>
    <View style={styles.app}>
      <StatusBar style="dark" />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <View style={styles.app} key={route}>{screens[route]}</View>
      {!keyboardOpen && <>
        <FloatingActions onChat={() => navigate('chat')} onNotifications={() => navigate('notifications')} />
        <BottomNav selected={selected} onSelect={navigate} />
      </>}
    </View>
  </AppContext.Provider>;
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background },
  message: { ...typography.body, color: colors.textMuted },
  error: { ...typography.body, color: '#A3343B', fontSize: 12, padding: 12, paddingTop: 48, backgroundColor: '#F7E8E8' },
});
