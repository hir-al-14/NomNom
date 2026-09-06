import { Minus, Plus, Salad } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Card, IconButton } from '../components/Primitives';
import { colors } from '../theme';
import type { Ingredient } from './types';
import { ownerStyles as s } from './styles';

export function Ingredients({ value, onChange }: { value: Ingredient[]; onChange: (value: Ingredient[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  function add() {
    const label = name.trim();
    if (!label) return;
    const exists = value.some((item) => item.name.toLowerCase() === label.toLowerCase());
    onChange(exists ? value.map((item) => item.name.toLowerCase() === label.toLowerCase()
      ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item) : [...value, { name: label, quantity: 1 }]);
    setName(''); setAdding(false);
  }
  function quantity(index: number, delta: number) {
    onChange(value.map((item, i) => i === index ? { ...item, quantity: Math.min(99, item.quantity + delta) } : item)
      .filter((item) => item.quantity > 0));
  }
  return <>
    <View style={s.row}><Text style={s.title}>Ingredients</Text>
      <Pressable accessibilityRole="button" onPress={() => setAdding(!adding)} style={{ paddingVertical: 10 }}><Text style={s.link}>Add Ingredient</Text></Pressable>
    </View><Text style={s.small}>{value.length} {value.length === 1 ? 'item' : 'items'}</Text>
    {adding && <Card><TextInput accessibilityLabel="Ingredient name" placeholder="Ingredient name" value={name}
      onChangeText={setName} maxLength={80} style={s.input} onSubmitEditing={add} />
      <Pressable accessibilityRole="button" onPress={add} disabled={!name.trim()} style={s.button}><Text style={s.buttonText}>Add ingredient</Text></Pressable>
    </Card>}
    {value.map((item, index) => <Card key={item.name}><View style={[s.row, { gap: 6 }]}>
      <View style={s.iconTile}><Salad size={24} color={colors.border} /></View>
      <Text style={s.menuName}>{item.name}</Text>
      <IconButton Icon={Minus} label={`Remove one ${item.name}`} color={colors.teal} onPress={() => quantity(index, -1)} />
      <Text style={s.small}>{item.quantity}</Text>
      <IconButton Icon={Plus} label={`Add one ${item.name}`} color={colors.teal} onPress={() => quantity(index, 1)} />
    </View></Card>)}
  </>;
}
