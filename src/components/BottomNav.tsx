import { ChefHat, Heart, House, Search, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cardShadow, colors } from '../theme';

export type Tab = 'home' | 'search' | 'note' | 'favorites' | 'profile';
const tabs = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'note', label: 'Food-note', Icon: ChefHat },
  { id: 'favorites', label: 'Favorites', Icon: Heart },
  { id: 'profile', label: 'Profile', Icon: UserRound },
] as const;

type Props = { selected: Tab; onSelect: (tab: Tab) => void };

export function BottomNav({ selected, onSelect }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {tabs.map(({ id, label, Icon }) => (
        <Pressable key={id} accessibilityRole="tab" accessibilityLabel={label}
          accessibilityState={{ selected: selected === id }}
          onPress={() => onSelect(id)} style={styles.tab}>
          <View style={id === 'note' ? styles.center : undefined}>
            <Icon size={30} strokeWidth={1.8}
              color={id === 'note' ? colors.surface : selected === id ? colors.teal : colors.mutedIcon} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    ...cardShadow,
    flexDirection: 'row',
    flexShrink: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  tab: { flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  center: {
    ...cardShadow,
    width: 64, height: 64, borderRadius: 32, marginTop: -40,
    backgroundColor: colors.deepTeal, borderWidth: 5, borderColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
});
