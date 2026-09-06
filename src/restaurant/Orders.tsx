import { Alert, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { useActivity } from '../state/useActivity';
import { supabase } from '../lib/supabase';
import { Card, Header } from '../components/Primitives';
import { Body, Screen } from '../components/ui';
import { money } from '../domain';
import { localId } from '../state/types';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function OwnerOrders() {
  const { user, store, navigate } = useOwner();
  const activity = useActivity(store.cloud, undefined, store.data.profile.id);
  const [busy, setBusy] = useState<string | null>(null);
  const orders = (store.cloud ? activity.orders : user.data.orders).filter((order) => order.items.some((item) => item.restaurantId === store.data.profile.id));
  return <Screen>
    <Header title="Orders" onBack={() => navigate('profile')} />
    {!!activity.error && <Body>{activity.error}</Body>}
    {!orders.length && <Body>No orders yet.</Body>}
    {orders.map((order) => <Card key={order.id}>
      <Text style={s.title}>{order.readyRestaurantIds?.includes(store.data.profile.id) ? 'Ready for pickup' : 'New order'}</Text>
      <Text style={s.small}>{new Date(order.placedAt).toLocaleString()}</Text>
      {!!order.customerName && <Body>{order.customerName}</Body>}
      {order.items.filter((item) => item.restaurantId === store.data.profile.id).map((item, index) => <Body key={index}>{item.quantity} × {item.name} · {money(item.priceCents * item.quantity)}</Body>)}
      {!order.readyRestaurantIds?.includes(store.data.profile.id) && <Pressable accessibilityRole="button" disabled={!!busy} style={s.button} onPress={async () => {
        if (store.cloud && supabase) {
          setBusy(order.id);
          const result = await supabase.from('orders').update({ status: 'ready' }).eq('id', order.id).select('id').single();
          setBusy(null);
          if (result.error) Alert.alert('Could not update order', 'Please try again.');
          else activity.refresh();
          return;
        }
        user.update((current) => ({
        ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, readyRestaurantIds: [...new Set([...(item.readyRestaurantIds ?? []), store.data.profile.id])] } : item),
        notifications: [{ id: localId(), title: 'Demo order ready', body: `${store.data.profile.name} marked your demo order ready for pickup.`,
          createdAt: new Date().toISOString(), read: false }, ...current.notifications],
      })); }}><Text style={s.buttonText}>{busy === order.id ? 'Updating…' : 'Mark ready'}</Text></Pressable>}
    </Card>)}
  </Screen>;
}
