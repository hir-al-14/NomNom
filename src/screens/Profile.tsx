import { PlusCircle,Settings as SettingsIcon,SquarePen,UserRound } from 'lucide-react-native';
import { Pressable,Text,View } from 'react-native';
import { Card,IconButton,Pill,Section } from '../components/Primitives';
import { Action,Screen } from '../components/ui';
import { restrictionLabel } from '../domain';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { Avatar,styles } from './ProfileShared';

export function Profile() {
  const { data, navigate } = useApp();
  return <Screen>
    <View style={styles.header}>
      <IconButton Icon={SettingsIcon} label="Settings" onPress={() => navigate('settings')} />
      <Text accessibilityRole="header" style={styles.title}>Profile</Text>
      <IconButton Icon={SquarePen} label="Edit profile" onPress={() => navigate('edit')} />
    </View>
    <Avatar /><View style={styles.divider} />
    <Section>Care Buddy</Section>
    <Pressable accessibilityRole="button" onPress={() => navigate('buddy')}>
      <Card><View style={styles.buddyRow}>
        <View style={styles.smallAvatar}><UserRound size={28} color={colors.border} /></View>
        <View style={{ flex: 1 }}><Text style={styles.name}>{data.buddy?.name || 'Add a care buddy'}</Text>
          <Text style={styles.caption}>{data.buddy?.email || 'A trusted person, when you need one'}</Text></View>
      </View></Card>
    </Pressable>
    <Section>Dietary restrictions</Section>
    <Card><View style={styles.chips}>
      {data.restrictions.map(({ tag, severity }) => <Pill key={tag} tone={severity} distinct={data.colorBlind}>
        {restrictionLabel(tag)} | {severity}
      </Pill>)}
      {!data.restrictions.length && <Text style={styles.caption}>No restrictions selected</Text>}
      <IconButton Icon={PlusCircle} label="Edit dietary restrictions" onPress={() => navigate('edit')} />
    </View></Card>
    <Action label="Food-note QR" onPress={() => navigate('note')} />
  </Screen>;
}

