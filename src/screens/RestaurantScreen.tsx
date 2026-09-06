import { menuSections } from '../domain';
import { useCatalog } from '../state/CatalogContext';
import { RestaurantPhoto } from '../components/RestaurantPhoto';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft,MessageCircle,ShoppingCart } from 'lucide-react-native';
import { useState } from 'react';
import { Image,Pressable,ScrollView,Text,View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton,Pill,Section } from '../components/Primitives';
import { Action, Body, Screen } from '../components/ui';
import { restaurantImages } from '../demo/images';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { MenuRow,styles } from './MealsShared';

export function RestaurantScreen() {
  const { restaurants, dishes: initialDishes } = useCatalog();
  const { restaurantId, navigate, data } = useApp();
  const [tab, setTab] = useState('Menu');
  const insets = useSafeAreaInsets();
  const restaurant = restaurants.find((item) => item.id === restaurantId);
  if (!restaurant) return <Screen><Body>No restaurant selected.</Body><Action label="Browse restaurants" onPress={() => navigate('search')} /></Screen>;
  const dishes = initialDishes.filter((dish) => dish.restaurantId === restaurant.id);
  return <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 24 }}>
    <StatusBar style="light" />
    <RestaurantPhoto restaurant={restaurant} />
    <View style={[styles.heroBar, { top: insets.top }]}>
      <IconButton Icon={ArrowLeft} label="Back to home" color="white" onPress={() => navigate('home')} />
      <IconButton Icon={ShoppingCart} label={`Cart, ${data.cart.length} dishes`} color="white" onPress={() => navigate('cart')} />
    </View>
    <View style={styles.content}>
      <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
      <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
      <View style={styles.divider} />
      <Text style={styles.address}>{restaurant.address}</Text>
      <View style={styles.badges}><Pill tone="neutral">{data && dishes.some((dish) => dish.source === 'manual') ? 'Restaurant menu' : 'Demo menu'}</Pill></View>
      <View style={styles.tabs}>{['Menu', 'Info', 'Reviews'].map((label) => (
        <Pressable key={label} accessibilityRole="tab" accessibilityState={{ selected: tab === label }}
          onPress={() => setTab(label)} style={[styles.tab, tab === label && styles.activeTab]}>
          <Text style={[styles.tabText, tab === label && styles.activeTabText]}>{label}</Text>
        </Pressable>
      ))}</View>
      {tab === 'Menu' && <>
        {!dishes.length && <Body>This restaurant has not added dishes yet.</Body>}
        {menuSections(dishes).map((section) => <View key={section.category} style={{ gap: 12 }}>
          <Section>{section.category}</Section>
          {section.dishes.map((dish) => <MenuRow key={dish.id} dish={dish} />)}
        </View>)}
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
