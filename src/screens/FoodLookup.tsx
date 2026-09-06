import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Action, Body, Screen } from '../components/ui';
import { Card, Header } from '../components/Primitives';
import { DishPhoto } from '../components/DishPhoto';
import { foodLookup, type FoodResult } from '../lib/foodLookup';
import { useApp } from '../state/AppContext';
import { useCatalog } from '../state/CatalogContext';
import { ownerStyles as s } from '../restaurant/styles';

export function FoodLookup() {
  const { navigate, signedIn } = useApp();
  const { addExternal, dishes } = useCatalog();
  const [results, setResults] = useState(() => dishes.filter((dish) => dish.source && dish.source !== 'manual') as FoodResult[]);
  const [provider, setProvider] = useState<FoodResult['source']>(results[0]?.source ?? 'nutritionix');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function lookup(item?: FoodResult) {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const foods = await foodLookup(item?.source ?? provider, query, item?.externalId);
      addExternal(foods);
      if (item && foods[0]) navigate('dish', foods[0].id);
      else setResults(foods);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Search failed.'); }
    finally { setBusy(false); }
  }
  return <Screen>
    <Header title="Food lookup" onBack={() => navigate('search')} />
    <View style={s.tabs}>{(['nutritionix', 'spoonacular'] as const).map((name) => <Pressable key={name}
      accessibilityRole="tab" accessibilityState={{ selected: provider === name }} disabled={busy}
      onPress={() => { setProvider(name); setResults([]); setError(''); }} style={[s.tab, name === provider && s.activeTab]}>
      <Text style={{ color: provider === name ? 'white' : '#0A2533' }}>{name === 'nutritionix' ? 'Nutritionix' : 'Spoonacular'}</Text>
    </Pressable>)}</View>
    <TextInput accessibilityLabel="Search food databases" placeholder="Dish or restaurant chain" value={query}
      onChangeText={setQuery} maxLength={80} style={s.input} editable={!busy} onSubmitEditing={() => { if (query.trim().length >= 2 && signedIn) lookup(); }} />
    {!signedIn && <Body>Sign in to search food databases.</Body>}
    <Action label={busy ? 'Loading…' : 'Search foods'} disabled={busy || !signedIn || query.trim().length < 2} onPress={() => lookup()} />
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {results.map((dish) => <Pressable key={dish.id} accessibilityRole="button" disabled={busy} onPress={() => lookup(dish)}>
      <Card><View style={s.row}><DishPhoto dish={dish} width={76} height={64} />
        <View style={{ flex: 1 }}><Text style={s.menuName}>{dish.name}</Text><Body>{dish.restaurantName}</Body></View>
      </View></Card>
    </Pressable>)}
    <Body>Food database results are reference information, not local restaurant menus. Prices, availability, and allergen details may be missing.</Body>
  </Screen>;
}
