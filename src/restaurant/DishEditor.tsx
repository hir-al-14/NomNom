import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DesignPhoto } from '../components/DesignPhoto';
import { IconButton } from '../components/Primitives';
import { colors } from '../theme';
import { localId } from '../state/types';
import { useOwner } from './context';
import { DishDetails, Nutrition } from './DishDetails';
import { Flags } from './Flags';
import { Ingredients } from './Ingredients';
import { emptyDish } from './seed';
import { ownerStyles as s } from './styles';
import { prepareDish } from './validateDish';

export function DishEditor() {
  const { store, dishId, navigate, user } = useOwner();
  const original = store.data.dishes.find((item) => item.id === dishId);
  const [dish, setDish] = useState(() => original ?? emptyDish(`window-${localId()}`));
  const [price, setPrice] = useState(original ? (original.priceCents / 100).toFixed(2) : '');
  const [details, setDetails] = useState(!original);
  const [tab, setTab] = useState('Ingredients');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();
  const dirty = JSON.stringify(dish) !== JSON.stringify(original) || price !== ((original?.priceCents ?? 0) / 100).toFixed(2);
  function close() {
    if (busy) return;
    if (!dirty) { navigate('profile'); return; }
    Alert.alert('Discard changes?', 'Your dish has not been saved.', [
      { text: 'Keep editing', style: 'cancel' }, { text: 'Discard', style: 'destructive', onPress: () => navigate('profile') },
    ]);
  }
  async function save(remove = false) {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const prepared = remove ? dish : prepareDish(dish, price);
      await store.save((current) => ({ ...current, dishes: remove ? current.dishes.filter((item) => item.id !== dish.id)
        : current.dishes.some((item) => item.id === dish.id) ? current.dishes.map((item) => item.id === dish.id ? prepared : item)
          : [...current.dishes, prepared] }));
      if (remove) user.update((current) => ({ ...current, cart: current.cart.filter((item) => item.dishId !== dish.id) }));
      navigate('profile');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not save the dish.'); }
    finally { setBusy(false); }
  }
  return <ScrollView style={s.page} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
    <StatusBar style="light" /><DesignPhoto photo={dish.photo} height={200} fitWidth />
    <View style={[s.heroHeader, { top: insets.top }]}><View style={{ backgroundColor: 'white', borderRadius: 12 }}>
      <IconButton Icon={X} label="Close dish editor" onPress={close} />
    </View></View>
    <View style={s.panel} pointerEvents={busy ? 'none' : 'auto'}>
      <View style={s.handle} /><Text style={s.title}>{dish.name || 'New dish'}</Text>
      <Text style={s.small}>{dish.description}</Text>
      <Pressable accessibilityRole="button" onPress={() => setDetails(!details)}><Text style={s.link}>{details ? 'Hide details' : 'Edit details'}</Text></Pressable>
      {details && <DishDetails dish={dish} onChange={setDish} price={price} setPrice={setPrice} />}
      <Nutrition dish={dish} />
      <View style={s.tabs}>{['Ingredients', 'Dietary Flags'].map((label) => <Pressable key={label} accessibilityRole="tab"
        accessibilityState={{ selected: tab === label }} onPress={() => setTab(label)} style={[s.tab, tab === label && s.activeTab]}>
        <Text style={[s.menuName, { flex: 0, color: tab === label ? 'white' : colors.text }]}>{label}</Text>
      </Pressable>)}</View>
      {tab === 'Ingredients' ? <Ingredients value={dish.portions} onChange={(portions) => setDish({ ...dish, portions, complete: false })} />
        : <Flags flags={dish.flags} notes={dish.flagNotes} onChange={(flags, flagNotes) => setDish({ ...dish, flags, flagNotes, complete: false })} />}
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => save()} style={s.button}><Text style={s.buttonText}>{busy ? 'Saving…' : 'Save Dish'}</Text></Pressable>
      {!!original && <Pressable accessibilityRole="button" onPress={() => Alert.alert('Delete dish?', 'This also removes the dish from your demo cart.', [
        { text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => save(true) },
      ])}><Text style={[s.error, { textAlign: 'center', padding: 12 }]}>Delete dish</Text></Pressable>}
    </View>
  </ScrollView>;
}
