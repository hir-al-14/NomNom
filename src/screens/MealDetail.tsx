import { useCatalog } from '../state/CatalogContext';
import { DishPhoto } from '../components/DishPhoto';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft,Beef,Droplet,Flame,MessageCircle,ShoppingCart,Wheat } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable,ScrollView,Text,View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton,Pill,Section } from '../components/Primitives';
import { Action,Body,Screen } from '../components/ui';
import type { MenuDish } from '../restaurant/types';
import { money,restrictionLabel } from '../domain';
import { matchDish } from '../matching';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { MatchPill,styles } from './MealsShared';

export function MealDetail() {
  const { dishes: initialDishes } = useCatalog();
  const { dishId, data, navigate, addToCart } = useApp();
  const [tab, setTab] = useState('Ingredients');
  const insets = useSafeAreaInsets();
  const dish = initialDishes.find((item) => item.id === dishId) ?? initialDishes[0];
  if (!dish) return <Screen><Body>This dish is no longer available.</Body><Action label="Back to search" onPress={() => navigate('search')} /></Screen>;
  const external = !!dish.source && dish.source !== 'manual';
  const match = matchDish(dish, data.restrictions);
  const details = dish as Partial<MenuDish>;
  return <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
    <StatusBar style="light" />
    <DishPhoto dish={dish} height={200} fitWidth />
    <View style={[styles.heroBar, { top: insets.top }]}>
      <IconButton Icon={ArrowLeft} label="Back" color="white" onPress={() => external ? navigate('lookup') : navigate('restaurant', dish.restaurantId)} />
      <IconButton Icon={ShoppingCart} label="View cart" color="white" onPress={() => navigate('cart')} />
    </View>
    <View style={styles.detailPanel}>
      <View style={styles.handle} />
      <Section>{dish.name}</Section><Body>{dish.description}</Body>
      <View style={styles.nutrition}>{[
        { key: 'carbs', label: 'g carbs', Icon: Wheat }, { key: 'protein', label: 'g protein', Icon: Beef },
        { key: 'calories', label: 'Kcal', Icon: Flame }, { key: 'fat', label: 'g fat', Icon: Droplet },
      ].map(({ key, label, Icon }) => <View key={label} style={styles.metric}>
        <View style={styles.metricIcon}><Icon size={22} color={colors.border} /></View>
        <Text style={styles.metricText}>{details.nutrition?.[key as keyof MenuDish['nutrition']] || '—'} {label}</Text>
      </View>)}</View>
      <Text style={styles.address}>Per serving · — means the amount has not been supplied.</Text>
      <View style={styles.tabs}>{['Ingredients', 'Dietary flags'].map((label) => <Pressable key={label}
        accessibilityRole="tab" accessibilityState={{ selected: tab === label }} onPress={() => setTab(label)}
        style={[styles.tab, tab === label && styles.activeTab]}>
        <Text style={[styles.tabText, tab === label && styles.activeTabText]}>{label}</Text>
      </Pressable>)}</View>
      {tab === 'Ingredients' ? <>
        <Section>Ingredients</Section><Body>{dish.ingredients.length} listed items</Body>
        {dish.ingredients.map((ingredient) => <View key={ingredient} style={styles.ingredient}><Body>{ingredient}</Body></View>)}
      </> : <>
        <Section>Dietary flags</Section><MatchPill dish={dish} />
        {match.conflicts.map(({ tag, severity }) => <View key={tag} style={styles.ingredient}>
          <Pill tone={severity} distinct={data.colorBlind}>{restrictionLabel(tag)} · {severity}</Pill>
          <Body>This dish conflicts with your {restrictionLabel(tag).toLowerCase()} preference.</Body>
        </View>)}
        <Body>{dish.flags.length ? `Listed flags: ${dish.flags.map((tag) => tag.replace('custom:', '')).join(', ')}` : 'No flags supplied.'}</Body>
        {dish.flags.filter((tag) => details.flagNotes?.[tag]).map((tag) => <Body key={tag}>{details.flagNotes?.[tag]}</Body>)}
        {!dish.complete && <Body>Dietary data is incomplete. Ask the restaurant before ordering.</Body>}
      </>}
      <Body>Confirm preparation and cross-contact details with the restaurant.</Body>
      {external ? <Body>Source: {dish.source}. Price and local availability are not supplied. This reference item cannot be ordered here.</Body>
        : <Action label={`Add to cart · ${money(dish.priceCents)}`} onPress={() => addToCart(dish.id)} />}
      {!external && <Pressable accessibilityRole="button" onPress={() => navigate('chat', dish.restaurantId)} style={styles.chatLink}>
        <MessageCircle size={20} color={colors.border} /><Text style={styles.linkText}>Chat with restaurant</Text>
      </Pressable>}
    </View>
  </ScrollView>;
}
