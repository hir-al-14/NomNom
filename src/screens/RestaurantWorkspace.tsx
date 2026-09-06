import { Store } from 'lucide-react-native';
import { View } from 'react-native';
import { Card, Header } from '../components/Primitives';
import { Action, Body, Screen } from '../components/ui';
import { colors } from '../theme';

type Props = { email?: string; onSwitch: () => void; onExit: () => void };

export function RestaurantWorkspace({ email, onSwitch, onExit }: Props) {
  return <Screen>
    <Header title="My restaurant" onBack={onSwitch} />
    <View style={{ alignItems: 'center', paddingVertical: 24 }}>
      <Store size={64} color={colors.border} strokeWidth={1.5} />
    </View>
    <Card>
      <Body>{email ? `Signed in as ${email}` : 'Restaurant demo'}</Body>
      <Body>You’re in restaurant mode. The restaurant dashboard, menu editor, and incoming orders haven’t been built yet.</Body>
    </Card>
    <Body>Your account works in both modes. Your personal profile stays separate from restaurant management.</Body>
    <Action label="Switch to personal mode" onPress={onSwitch} />
    <Action label={email ? 'Log out' : 'Exit demo'} onPress={onExit} />
  </Screen>;
}
