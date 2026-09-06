import { Camera, ChefHat, UserRound } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingActions } from '../components/FloatingActions';
import { cardShadow, colors } from '../theme';
import { useOwner, type OwnerRoute } from './context';

export function OwnerNavigation({ route }: { route: OwnerRoute }) {
  const { navigate } = useOwner();
  const insets = useSafeAreaInsets();
  return <>
    <FloatingActions onChat={() => navigate('chat')} onNotifications={() => navigate('orders')} />
    <View style={{ ...cardShadow, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24,
      flexDirection: 'row', paddingTop: 12, paddingBottom: Math.max(12, insets.bottom), flexShrink: 0 }}>
      {([{ id: 'scan', label: 'Scan Food-note', Icon: Camera }, { id: 'menu', label: 'Menu', Icon: ChefHat },
        { id: 'profile', label: 'Restaurant profile', Icon: UserRound }] as const).map(({ id, label, Icon }) => <Pressable
        key={id} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: route === id }}
        onPress={() => navigate(id === 'menu' ? 'profile' : id)} style={{ flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center' }}>
        <View style={id === 'menu' ? { ...cardShadow, backgroundColor: colors.deepTeal, width: 64, height: 64,
          borderRadius: 32, marginTop: -40, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: 'white' } : undefined}>
          <Icon size={30} strokeWidth={1.8} color={id === 'menu' ? 'white' : route === id ? colors.teal : colors.mutedIcon} />
        </View>
      </Pressable>)}
    </View>
  </>;
}
