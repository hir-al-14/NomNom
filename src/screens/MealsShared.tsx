import { Plus } from 'lucide-react-native';
import { Image,Pressable,StyleSheet,Text,View } from 'react-native';
import { IconButton,Pill } from '../components/Primitives';
import { dishImages } from '../demo/images';
import { DishPhoto } from '../components/DishPhoto';
import { type Dish } from '../domain';
import { matchDish } from '../matching';
import { useApp } from '../state/AppContext';
import { cardShadow,colors,typography } from '../theme';

export function MatchPill({ dish }: { dish: Dish }) {
  const { data } = useApp();
  const match = matchDish(dish, data.restrictions);
  const tone = match.status === 'conflict' ? 'medium' : match.status === 'match' ? 'low' : 'neutral';
  return <Pill tone={tone} distinct={data.colorBlind}>{match.label}</Pill>;
}

export function MenuRow({ dish }: { dish: Dish }) {
  const { navigate, addToCart } = useApp();
  return <View style={styles.menuRow}>
    <Pressable accessibilityRole="button" accessibilityLabel={`View ${dish.name}`}
      onPress={() => navigate('dish', dish.id)} style={styles.dishLink}>
      <DishPhoto dish={dish} width={80} height={62} />
      <View style={styles.dishText}><Text style={styles.dishName}>{dish.name}</Text><MatchPill dish={dish} /></View>
    </Pressable>
    <IconButton Icon={Plus} label={`Add ${dish.name} to cart`} color={colors.deepTeal} onPress={() => addToCart(dish.id)} />
  </View>;
}

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', height: 280, resizeMode: 'cover' },
  heroBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  content: { padding: 22, gap: 10, maxWidth: 520, width: '100%', alignSelf: 'center' },
  restaurantTitle: { ...typography.title, fontSize: 24, color: colors.text, textAlign: 'center' },
  cuisine: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  divider: { height: 2, width: 244, backgroundColor: '#BCE4E7', alignSelf: 'center' },
  address: { ...typography.body, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  badges: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginVertical: 6 },
  tabs: { flexDirection: 'row', backgroundColor: colors.tabs, borderRadius: 20, padding: 3, marginVertical: 6 },
  tab: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  activeTab: { backgroundColor: colors.deepTeal },
  tabText: { ...typography.body, fontFamily: typography.title.fontFamily, fontSize: 13, color: colors.deepTeal },
  activeTabText: { color: colors.surface },
  menuRow: { ...cardShadow, backgroundColor: colors.surface, borderRadius: 16, padding: 8, flexDirection: 'row', alignItems: 'center' },
  dishLink: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  thumb: { width: 80, height: 62, borderRadius: 16 },
  dishText: { flex: 1, gap: 5 },
  dishName: { ...typography.body, fontFamily: typography.title.fontFamily, fontSize: 15, color: colors.text },
  chatLink: { flexDirection: 'row', gap: 8, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  linkText: { ...typography.body, fontSize: 13, color: colors.border },
  detailPanel: { padding: 24, marginTop: -24, backgroundColor: colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, gap: 16 },
  handle: { width: 50, height: 4, borderRadius: 2, backgroundColor: colors.paleTeal, alignSelf: 'center', marginBottom: 20 },
  nutrition: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metric: { width: '46%', flexDirection: 'row', alignItems: 'center', gap: 10 },
  metricIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center' },
  metricText: { ...typography.body, fontSize: 14, color: colors.textMuted },
  ingredient: { padding: 16, borderRadius: 16, backgroundColor: colors.selected, gap: 10 },
});
