import { Minus,Plus,Square,SquareCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Alert,Pressable,StyleSheet,Text,View } from 'react-native';
import { Header,IconButton,Pill } from '../components/Primitives';
import { Action,Body,Screen } from '../components/ui';
import { initialDishes,restaurants } from '../demo/menu';
import { money } from '../domain';
import { matchDish } from '../matching';
import { useApp } from '../state/AppContext';
import { localId } from '../state/types';
import { cardShadow,colors,typography } from '../theme';

export function Cart() {
  const { data, update, navigate } = useApp();
  const [excluded, setExcluded] = useState<string[]>([]);
  const selected = data.cart.filter((item) => !excluded.includes(item.dishId));
  const total = selected.reduce((sum, item) => sum + (initialDishes.find((dish) => dish.id === item.dishId)?.priceCents ?? 0) * item.quantity, 0);
  function quantity(id: string, delta: number) {
    update((current) => ({ ...current, cart: current.cart.map((item) => item.dishId === id
      ? { ...item, quantity: Math.min(99, item.quantity + delta) } : item).filter((item) => item.quantity > 0) }));
  }
  function placeOrder() {
    if (!selected.length) return;
    const complete = () => {
      const id = localId();
      const createdAt = new Date().toISOString();
      const items = selected.flatMap((item) => {
        const dish = initialDishes.find((entry) => entry.id === item.dishId);
        return dish ? [{ name: dish.name, quantity: item.quantity, priceCents: dish.priceCents }] : [];
      });
      update((current) => ({ ...current, cart: current.cart.filter((item) => !selected.some((entry) => entry.dishId === item.dishId)),
        orders: [{ id, placedAt: createdAt, items, totalCents: total }, ...current.orders],
        notifications: [{ id, title: 'Demo order placed', body: `${items.reduce((sum, item) => sum + item.quantity, 0)} items · ${money(total)}. No restaurant was charged or notified.`, createdAt, read: false }, ...current.notifications] }));
      Alert.alert('Demo order saved', 'This order is saved on your device. No payment or restaurant order was sent.', [
        { text: 'View activity', onPress: () => navigate('notifications') },
      ]);
    };
    const flagged = selected.flatMap((item) => {
      const dish = initialDishes.find((entry) => entry.id === item.dishId);
      if (!dish) return [];
      const status = matchDish(dish, data.restrictions).status;
      return status === 'conflict' || status === 'unknown' ? [dish.name] : [];
    });
    if (flagged.length) Alert.alert('Review dietary details', `${flagged.join(', ')} have conflicts or incomplete information.`, [
      { text: 'Review cart', style: 'cancel' }, { text: 'Place demo order', onPress: complete },
    ]);
    else complete();
  }
  return <Screen>
    <Header title="Cart" onBack={() => navigate('home')} />
    {!data.cart.length && <Body>Your cart is empty. Browse a restaurant to add a meal.</Body>}
    {restaurants.map((restaurant) => {
      const items = data.cart.filter((item) => initialDishes.find((dish) => dish.id === item.dishId)?.restaurantId === restaurant.id);
      if (!items.length) return null;
      return <View key={restaurant.id} style={styles.group}>
        <View style={styles.groupHeader}><Text style={styles.groupTitle}>{restaurant.name}  ·  Sample menu</Text></View>
        {items.map((item) => {
          const dish = initialDishes.find((entry) => entry.id === item.dishId)!;
          const match = matchDish(dish, data.restrictions);
          const checked = !excluded.includes(item.dishId);
          const Check = checked ? SquareCheck : Square;
          return <View key={item.dishId} style={styles.row}>
            <Pressable accessibilityRole="checkbox" accessibilityLabel={`Include ${dish.name}`} accessibilityState={{ checked }}
              style={styles.check} onPress={() => setExcluded(checked ? [...excluded, item.dishId] : excluded.filter((id) => id !== item.dishId))}>
              <Check size={20} color={colors.text} />
            </Pressable>
            <View style={styles.item}>
              <Pressable accessibilityRole="button" onPress={() => navigate('dish', dish.id)}><Text style={styles.name}>{dish.name}</Text></Pressable>
              <Text style={styles.price}>{money(dish.priceCents)} each</Text>
              <Pill tone={match.status === 'conflict' ? 'medium' : match.status === 'match' ? 'low' : 'neutral'} distinct={data.colorBlind}>{match.label}</Pill>
              <View style={styles.quantity}>
                <IconButton Icon={Minus} label={`Remove one ${dish.name}`} onPress={() => quantity(dish.id, -1)} />
                <Text style={styles.price}>{item.quantity}</Text>
                <IconButton Icon={Plus} label={`Add one ${dish.name}`} onPress={() => quantity(dish.id, 1)} />
                <Text style={styles.price}>{money(dish.priceCents * item.quantity)}</Text>
              </View>
            </View>
          </View>;
        })}
      </View>;
    })}
    <View style={styles.subtotal}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.total}>{money(total)}</Text></View>
    <Action label="Place demo order" disabled={!selected.length} onPress={placeOrder} />
    <Body>Demo checkout · No payment or approval step.</Body>
  </Screen>;
}

const styles = StyleSheet.create({
  group: { ...cardShadow, borderRadius: 16, backgroundColor: colors.surface, paddingBottom: 12 },
  groupHeader: { backgroundColor: colors.paleTeal, borderRadius: 12, padding: 14 },
  groupTitle: { ...typography.body, fontSize: 12, color: colors.border },
  row: { flexDirection: 'row', paddingHorizontal: 6, paddingTop: 14 },
  check: { width: 36, minHeight: 44, alignItems: 'center', paddingTop: 6 },
  item: { flex: 1, gap: 4 },
  name: { ...typography.section, fontSize: 17, color: colors.text },
  price: { ...typography.body, fontSize: 12, color: colors.textMuted },
  quantity: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  subtotal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  totalLabel: { ...typography.body, color: colors.textMuted, fontSize: 20 },
  total: { ...typography.section, color: colors.textMuted },
});
