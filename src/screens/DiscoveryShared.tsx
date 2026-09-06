import { useCatalog } from '../state/CatalogContext';
import { DesignPhoto } from '../components/DesignPhoto';
import { Heart, Store } from 'lucide-react-native';
import { Image,Pressable,StyleSheet,Text,View } from 'react-native';
import { restaurantImages } from '../demo/images';
import type { Restaurant } from '../domain';
import { matchDish } from '../matching';
import { useApp } from '../state/AppContext';
import { cardShadow,colors,typography } from '../theme';

export function RestaurantCard({ restaurant, grid = false }: { restaurant: Restaurant; grid?: boolean }) {
  const { dishes: initialDishes } = useCatalog();
  const { data, update, navigate } = useApp();
  const favorite = data.favorites.includes(restaurant.id);
  const dishes = initialDishes.filter((dish) => dish.restaurantId === restaurant.id);
  const matches = dishes.filter((dish) => matchDish(dish, data.restrictions).status === 'match').length;
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${restaurant.name}`}
    onPress={() => navigate('restaurant', restaurant.id)} style={[styles.card, grid && styles.gridCard]}>
    {restaurant.id === 'window' ? <DesignPhoto photo="cafe" height={78} /> : restaurantImages[restaurant.id]
      ? <Image source={restaurantImages[restaurant.id]} style={styles.photo} />
      : <View style={[styles.photo, { backgroundColor: colors.paleTeal, alignItems: 'center', justifyContent: 'center' }]}><Store size={32} color={colors.border} /></View>}
    <Pressable accessibilityRole="button" accessibilityLabel={`${favorite ? 'Remove' : 'Save'} ${restaurant.name}`}
      accessibilityState={{ selected: favorite }} style={styles.heart} onPress={(event) => {
        event.stopPropagation();
        update((current) => ({ ...current, favorites: favorite
          ? current.favorites.filter((id) => id !== restaurant.id) : [...current.favorites, restaurant.id] }));
      }}>
      <Heart size={17} color={colors.teal} fill={favorite ? colors.teal : 'transparent'} />
    </Pressable>
    <Text numberOfLines={2} style={styles.name}>{restaurant.name}</Text>
    <Text style={styles.match}>{data.restrictions.length && dishes.length ? `${matches} listed matches` : 'View menu'}</Text>
  </Pressable>;
}

export const styles = StyleSheet.create({
  greeting: { flexDirection: 'row', alignItems: 'center' },
  inline: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  small: { ...typography.body, fontSize: 13, color: colors.text },
  title: { ...typography.section, color: colors.text, fontSize: 24, marginTop: 2 },
  search: { ...cardShadow, flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 12, backgroundColor: colors.surface, paddingHorizontal: 16, minHeight: 44 },
  placeholder: { ...typography.body, fontSize: 12, color: colors.border },
  searchInput: { ...typography.body, color: colors.text, flex: 1, minHeight: 44, fontSize: 14 },
  prompt: { ...typography.body, fontSize: 12, color: colors.border },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  seeAll: { ...typography.body, color: colors.teal, fontSize: 13 },
  row: { gap: 12, paddingVertical: 6, paddingHorizontal: 2 },
  card: { ...cardShadow, width: 130, borderRadius: 16, backgroundColor: colors.surface, padding: 10, gap: 4 },
  gridCard: { width: '47%' },
  photo: { width: '100%', height: 78, borderRadius: 10 },
  heart: { position: 'absolute', top: 8, right: 8, minWidth: 34, minHeight: 34, borderRadius: 6, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.body, fontFamily: typography.title.fontFamily, color: colors.text, fontSize: 14, lineHeight: 19, minHeight: 38 },
  match: { ...typography.body, fontSize: 12, color: colors.mutedIcon },
  activity: { ...cardShadow, backgroundColor: colors.surface, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 20 },
  activityText: { ...typography.section, fontSize: 17, color: colors.text, flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 2 },
});
