import { Beef, Droplet, Flame, Wheat } from 'lucide-react-native';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { DishPhoto } from '../components/DishPhoto';
import { dishCategories } from '../domain';
import { colors } from '../theme';
import type { MenuDish } from './types';
import { ownerStyles as s } from './styles';

export function Nutrition({ dish }: { dish: MenuDish }) {
  return <View style={s.nutrition}>
    {([{ key: 'carbs', label: 'g carbs', Icon: Wheat }, { key: 'protein', label: 'g proteins', Icon: Beef },
      { key: 'calories', label: 'Kcal', Icon: Flame }, { key: 'fat', label: 'g fats', Icon: Droplet }] as const).map(({ key, label, Icon }) => (
      <View key={key} style={s.metric}><View style={s.iconTile}><Icon size={22} color={colors.border} /></View>
        <Text style={s.small}>{dish.nutrition[key] || '—'} {label}</Text>
      </View>
    ))}
  </View>;
}

export function DishDetails({ dish, price, setPrice, onChange }: {
  dish: MenuDish; price: string; setPrice: (value: string) => void; onChange: (value: MenuDish) => void;
}) {
  return <>
    <TextInput accessibilityLabel="Dish name" placeholder="Dish name" value={dish.name} maxLength={80}
      onChangeText={(name) => onChange({ ...dish, name })} style={s.input} />
    <TextInput accessibilityLabel="Dish description" placeholder="Description" value={dish.description} multiline maxLength={500}
      onChangeText={(description) => onChange({ ...dish, description })} style={s.input} />
    <Text style={s.small}>Category</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {dishCategories.map((category) => <Pressable key={category} accessibilityRole="radio"
        accessibilityState={{ checked: dish.category === category }} onPress={() => onChange({ ...dish, category })}
        style={[s.chip, dish.category === category && { backgroundColor: colors.paleTeal }]}><Text style={s.small}>{category}</Text></Pressable>)}
    </View>
    <Text style={s.small}>Price ($)</Text><TextInput accessibilityLabel="Price in dollars" value={price} onChangeText={setPrice}
      keyboardType="decimal-pad" style={s.input} />
    <Text style={s.small}>Photo</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {(['toast', 'cupcake', 'latte', 'rice-bowl', 'tomato-soup', 'avocado-toast', 'seasonal-special'] as const).map((photo) => <Pressable key={photo} accessibilityRole="radio"
        accessibilityLabel={`${photo} photo`} accessibilityState={{ checked: dish.photo === photo }}
        onPress={() => onChange({ ...dish, photo })} style={{ borderWidth: 2, padding: 2, borderRadius: 14,
          borderColor: dish.photo === photo ? colors.teal : 'transparent' }}><DishPhoto dish={{ ...dish, photo } as MenuDish} width={70} height={70} /></Pressable>)}
    </View>
    <Text style={s.small}>Nutrition per serving (leave blank if unknown)</Text>
    {(Object.keys(dish.nutrition) as (keyof MenuDish['nutrition'])[]).map((key) => <TextInput key={key}
      accessibilityLabel={key} placeholder={key} keyboardType="decimal-pad" value={dish.nutrition[key]}
      onChangeText={(value) => onChange({ ...dish, nutrition: { ...dish.nutrition, [key]: value } })} style={s.input} />)}
    <View style={s.row}><Text style={[s.small, { flex: 1 }]}>Ingredient list and dietary flags are complete</Text>
      <Switch accessibilityLabel="Dietary information is complete" value={dish.complete}
        onValueChange={(complete) => onChange({ ...dish, complete })} trackColor={{ true: colors.teal }} />
    </View>
  </>;
}
