import { Alert,Share,View,useWindowDimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Card,Header } from '../components/Primitives';
import { Action,Body,Screen } from '../components/ui';
import { restrictionLabel } from '../domain';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { Avatar,styles } from './ProfileShared';

export function FoodNote() {
  const { data, navigate } = useApp();
  const { width } = useWindowDimensions();
  const summary = `${data.name || 'My'} Food-note\n${data.restrictions.map(({ tag, severity }) => `${restrictionLabel(tag)}: ${severity}`).join('\n') || 'No dietary restrictions selected.'}`;
  const payload = JSON.stringify({ app: 'nomnom', version: 1, name: data.name, restrictions: data.restrictions });
  return <Screen>
    <Header title="Food-note" onBack={() => navigate('profile')} /><Avatar />
    <Card><View style={styles.qr}><QRCode value={payload} size={Math.min(width - 100, 260)} color={colors.deepTeal} /></View></Card>
    <Body>The QR contains only your name and current dietary restrictions. Show it to restaurant staff.</Body>
    {!data.restrictions.length && <Body>Add your dietary needs in Profile before sharing.</Body>}
    <Action label="Share Food-note" onPress={() => {
      Share.share({ message: summary }).catch(() => Alert.alert('Unable to share', 'Please try again.'));
    }} />
  </Screen>;
}

