import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Body, Heading, Screen } from '../components/ui';
import { money, restrictionLabel, type Dish, type Restriction } from '../domain';
import { restaurants } from '../demo/menu';
import { matchDish } from '../matching';
import { colors, typography } from '../theme';

type Props = {
  dishes: Dish[];
  restrictions: Restriction[];
  onSelect: (dish: Dish) => void;
  onProfile: () => void;
  onCart: () => void;
  onExit: () => void;
};

export function MenuScreen({ dishes, restrictions, onSelect, onProfile, onCart, onExit }: Props) {
  return (
    <Screen>
      <Body>YOUR NEXT GOOD MEAL</Body>
      <Heading>{restaurants[0].name}</Heading>
      <Body>{restaurants[0].cuisine}</Body>
      <Body>{restrictions.length
        ? restrictions.map(({ tag }) => restrictionLabel(tag)).join(' · ')
        : 'No dietary needs selected yet.'}</Body>
      <Action label="Edit dietary profile" onPress={onProfile} />
      <Action label="View cart" onPress={onCart} />
      {dishes.map((dish) => {
        const match = matchDish(dish, restrictions);
        return (
          <Pressable
            key={dish.id}
            accessibilityRole="button"
            accessibilityLabel={`${dish.name}, ${money(dish.priceCents)}, ${match.label}`}
            onPress={() => onSelect(dish)}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.row}>
              <Text style={styles.name}>{dish.name}</Text>
              <Text style={styles.price}>{money(dish.priceCents)}</Text>
            </View>
            <Body>{dish.description}</Body>
            <Text style={styles.status}>{match.label} →</Text>
          </Pressable>
        );
      })}
      <Body>Sample menu for testing. Ingredient data is fictional.</Body>
      <Action label="Back to welcome" onPress={onExit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, gap: 12, borderRadius: 20, backgroundColor: colors.surface },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  name: { ...typography.body, fontFamily: typography.title.fontFamily, flex: 1, color: colors.text },
  price: { ...typography.body, color: colors.textMuted },
  status: { ...typography.body, fontSize: 13, color: colors.primary },
});
