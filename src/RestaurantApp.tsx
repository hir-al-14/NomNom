import { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Action, Body, Screen } from './components/ui';
import { Header } from './components/Primitives';
import { OwnerContext, type OwnerContextValue, type OwnerRoute } from './restaurant/context';
import { YourRestaurants } from './restaurant/YourRestaurants';
import { OwnerProfile } from './restaurant/Profile';
import { EditRestaurantProfile } from './restaurant/EditProfile';
import { DishEditor } from './restaurant/DishEditor';
import { OwnerChat } from './restaurant/Chat';
import { OwnerOrders } from './restaurant/Orders';
import { Scanner } from './restaurant/Scanner';
import { OwnerNavigation } from './restaurant/Navigation';
import { ownerStyles as s } from './restaurant/styles';

type Props = Pick<OwnerContextValue, 'store' | 'user' | 'onSwitch' | 'onExit'>;
export function RestaurantApp({ store, user, onSwitch, onExit }: Props) {
  const [route, setRoute] = useState<OwnerRoute>('restaurants');
  const [dishId, setDishId] = useState('');
  const [threadId, setThreadId] = useState('');
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  function navigate(next: OwnerRoute, id?: string) {
    Keyboard.dismiss();
    if (id && next === 'thread') setThreadId(id);
    else if (id) setDishId(id);
    setRoute(next);
  }
  if (!store.ready) return <View style={[s.page, { justifyContent: 'center' }]}><ActivityIndicator /></View>;
  return <OwnerContext.Provider value={{ store, user, navigate, dishId, threadId, onSwitch, onExit }}>
    <View style={s.page}>
      <StatusBar style="dark" />
      {!!store.error && <Text style={[s.error, { padding: 24 }]}>{store.error}</Text>}
      <View key={`${route}:${dishId}:${store.data.profile.id}`} style={s.page}>
        {route === 'restaurants' && <YourRestaurants />}
        {route === 'profile' && <OwnerProfile />}
        {route === 'editProfile' && <EditRestaurantProfile />}
        {route === 'dish' && <DishEditor />}
        {route === 'chat' && <OwnerChat />}
        {route === 'thread' && <OwnerChat thread />}
        {route === 'orders' && <OwnerOrders />}
        {route === 'scan' && <Scanner />}
        {route === 'settings' && <Screen>
          <Header title="Settings" onBack={() => navigate('profile')} />
          <Body>{store.cloud ? 'Menus, messages, and orders are synced with your account.' : 'This restaurant workspace is a local demo on this device.'}</Body>
          <Action label="Switch to personal mode" onPress={onSwitch} />
          <Action label="Log out / exit demo" onPress={onExit} />
        </Screen>}
      </View>
      {!keyboard && !['restaurants', 'dish', 'editProfile'].includes(route) && <OwnerNavigation route={route} />}
    </View>
  </OwnerContext.Provider>;
}
