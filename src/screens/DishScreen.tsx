import { Alert } from 'react-native';
import { Action, Body, Heading, Screen } from '../components/ui';
import { money, restrictionLabel, type Dish, type Restriction } from '../domain';
import { matchDish } from '../matching';

type Props = {
  dish: Dish;
  restrictions: Restriction[];
  onBack: () => void;
  onAdd: () => void;
};

export function DishScreen({ dish, restrictions, onBack, onAdd }: Props) {
  const match = matchDish(dish, restrictions);
  function add() {
    if (match.status === 'conflict' || match.status === 'unknown') {
      Alert.alert(match.label, 'Review the dietary details before adding this item.', [
        { text: 'Go back', style: 'cancel' },
        { text: 'Add anyway', onPress: onAdd },
      ]);
    } else {
      onAdd();
    }
  }
  return (
    <Screen>
      <Action label="Back to menu" onPress={onBack} />
      <Heading>{dish.name}</Heading>
      <Body>{dish.description}</Body>
      <Body>{money(dish.priceCents)}</Body>
      <Heading>Ingredients</Heading>
      {dish.ingredients.map((ingredient) => <Body key={ingredient}>• {ingredient}</Body>)}
      <Heading>Dietary flags</Heading>
      <Body>{match.label}</Body>
      {match.conflicts.map(({ tag, severity }) => (
        <Body key={tag}>{restrictionLabel(tag)} conflicts with this dish · {severity} priority</Body>
      ))}
      <Body>{dish.complete
        ? `Listed flags: ${dish.flags.join(', ') || 'none'}.`
        : 'The restaurant has not supplied complete dietary information.'}</Body>
      <Body>Listed ingredients do not cover every preparation or cross-contact risk. Confirm with staff.</Body>
      <Action label={`Add to cart · ${money(dish.priceCents)}`} onPress={add} />
    </Screen>
  );
}
