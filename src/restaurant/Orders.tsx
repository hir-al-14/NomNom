import { Pressable, Text } from 'react-native';
import { Card, Header } from '../components/Primitives';
import { Body, Screen } from '../components/ui';
import { money } from '../domain';
import { localId } from '../state/types';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function OwnerOrders() {
  const { user, store, navigate } = useOwner();
  const orders = user.data.orders.filter((order) => order.items.some((item) => item.restaurantId === store.data.profile.id));
  return <Screen>
    <Header title="Orders" onBack={() => navigate('profile')} />
    {!orders.length && <Body>No orders yet. Place a demo order at this restaurant from personal mode.</Body>}
    {orders.map((order) => <Card key={order.id}>
      <Text style={s.title}>{order.readyRestaurantIds?.includes(store.data.profile.id) ? 'Ready for pickup' : 'New order'}</Text>
      <Text style={s.small}>{new Date(order.placedAt).toLocaleString()}</Text>
      {order.items.filter((item) => item.restaurantId === store.data.profile.id).map((item, index) => <Body key={index}>{item.quantity} × {item.name} · {money(item.priceCents * item.quantity)}</Body>)}
      {!order.readyRestaurantIds?.includes(store.data.profile.id) && <Pressable accessibilityRole="button" style={s.button} onPress={() => user.update((current) => ({
        ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, readyRestaurantIds: [...new Set([...(item.readyRestaurantIds ?? []), store.data.profile.id])] } : item),
        notifications: [{ id: localId(), title: 'Demo order ready', body: `${store.data.profile.name} marked your demo order ready for pickup.`,
          createdAt: new Date().toISOString(), read: false }, ...current.notifications],
      }))}><Text style={s.buttonText}>Mark ready</Text></Pressable>}
    </Card>)}
  </Screen>;
}
