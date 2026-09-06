import { StatusBar } from 'expo-status-bar';
import { ArrowLeft,MessageCircle,ShoppingCart } from 'lucide-react-native';
import { useState } from 'react';
import { Image,Pressable,ScrollView,Text,View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton,Pill,Section } from '../components/Primitives';
import { Body } from '../components/ui';
import { restaurantImages } from '../demo/images';
import { initialDishes,restaurants } from '../demo/menu';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { MenuRow,styles } from './MealsShared';

export function RestaurantScreen() {
  const { restaurantId, navigate, data } = useApp();
  const [tab, setTab] = useState('Menu');
  const insets = useSafeAreaInsets();
  const restaurant = restaurants.find((item) => item.id === restaurantId) ?? restaurants[0];
  const dishes = initialDishes.filter((dish) => dish.restaurantId === restaurant.id);
  return <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
    <StatusBar style="light" />
    <Image source={restaurantImages[restaurant.id]} style={styles.hero} />
    <View style={[styles.heroBar, { top: insets.top }]}>
      <IconButton Icon={ArrowLeft} label="Back to home" color="white" onPress={() => navigate('home')} />
      <IconButton Icon={ShoppingCart} label={`Cart, ${data.cart.length} dishes`} color="white" onPress={() => navigate('cart')} />
    </View>
    <View style={styles.content}>
      <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
      <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
      <View style={styles.divider} />
      <Text style={styles.address}>{restaurant.address}</Text>
      <View style={styles.badges}><Pill tone="neutral">Demo menu</Pill><Pill tone="neutral">Sample prices</Pill></View>
      <View style={styles.tabs}>{['Menu', 'Info', 'Reviews'].map((label) => (
        <Pressable key={label} accessibilityRole="tab" accessibilityState={{ selected: tab === label }}
          onPress={() => setTab(label)} style={[styles.tab, tab === label && styles.activeTab]}>
          <Text style={[styles.tabText, tab === label && styles.activeTabText]}>{label}</Text>
        </Pressable>
      ))}</View>
      {tab === 'Menu' && <>
        {!dishes.length && <Body>This sample listing does not have a menu yet. Cava has a menu you can explore.</Body>}
        {!!dishes.length && <Body>Bowls</Body>}
        {dishes.filter((dish) => dish.id !== 'seasonal-special').map((dish) => <MenuRow key={dish.id} dish={dish} />)}
        {!!dishes.length && <Body>Sides</Body>}
        {dishes.filter((dish) => dish.id === 'seasonal-special').map((dish) => <MenuRow key={dish.id} dish={dish} />)}
      </>}
      {tab === 'Info' && <><Section>About this listing</Section><Body>{restaurant.address}</Body>
        <Body>Photos and restaurant names follow the wireframes. Ingredient information and prices are demonstration data.</Body></>}
      {tab === 'Reviews' && <Body>No reviews yet.</Body>}
      <Pressable accessibilityRole="button" onPress={() => navigate('chat', restaurant.id)} style={styles.chatLink}>
        <MessageCircle size={20} color={colors.border} /><Text style={styles.linkText}>Ask about ingredients</Text>
      </Pressable>
    </View>
  </ScrollView>;
}

