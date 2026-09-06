import { Bell, MessageCircle } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { cardShadow, colors } from '../theme';

type Props = {
  onChat: () => void;
  onNotifications: () => void;
};

export function FloatingActions({ onChat, onNotifications }: Props) {
  return <View pointerEvents="box-none" style={styles.actions}>
    {[{ label: 'Messages', Icon: MessageCircle, onPress: onChat },
      { label: 'Notifications', Icon: Bell, onPress: onNotifications }].map(({ label, Icon, onPress }) => (
      <Pressable key={label} accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.65 }]}>
        <Icon size={30} strokeWidth={1.8} color={colors.deepTeal} />
      </Pressable>
    ))}
  </View>;
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12,
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32, flexShrink: 0 },
  button: { ...cardShadow, width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
