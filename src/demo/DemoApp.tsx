import { useState } from 'react';
import { Action, Body, Heading, Screen } from '../components/ui';
import { type Dish, type Restriction, money } from '../domain';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { DishScreen } from '../screens/DishScreen';
import { initialDishes } from './menu';

type Props = { previewMenu: boolean; onExit: () => void };

export function DemoApp({ previewMenu, onExit }: Props) {
  const [route, setRoute] = useState(previewMenu ? 'menu' : 'profile');
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [cart, setCart] = useState<Dish[]>([]);
  if (selected) {
    return <DishScreen dish={selected} restrictions={restrictions}
      onBack={() => setSelected(null)} onAdd={() => {
        setCart((items) => [...items, selected]);
        setSelected(null);
        setRoute('cart');
      }} />;
  }
  if (route === 'profile') {
    return <ProfileScreen restrictions={restrictions} onChange={setRestrictions}
      onDone={() => setRoute('menu')} />;
  }
  if (route === 'cart') {
    return (
      <Screen>
        <Heading>Your cart</Heading>
        <Body>Demo only · No order has been sent.</Body>
        {cart.map((dish, index) => (
          <Body key={`${dish.id}-${index}`}>{dish.name} · {money(dish.priceCents)}</Body>
        ))}
        <Heading>Total: {money(cart.reduce((sum, dish) => sum + dish.priceCents, 0))}</Heading>
        <Action label="Clear cart" disabled={!cart.length} onPress={() => setCart([])} />
        <Action label="Keep browsing" onPress={() => setRoute('menu')} />
        <Action label="Back to welcome" onPress={onExit} />
      </Screen>
    );
  }
  return <MenuScreen dishes={initialDishes} restrictions={restrictions}
    onSelect={setSelected} onProfile={() => setRoute('profile')}
    onCart={() => setRoute('cart')} onExit={onExit} />;
}
