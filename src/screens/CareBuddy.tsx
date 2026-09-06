import { useState } from 'react';
import { Text,TextInput } from 'react-native';
import { Header } from '../components/Primitives';
import { Action,Body,Screen } from '../components/ui';
import { useApp } from '../state/AppContext';

import { styles } from './ProfileShared';

export function CareBuddy() {
  const { data, update, navigate } = useApp();
  const [name, setName] = useState(data.buddy?.name ?? '');
  const [email, setEmail] = useState(data.buddy?.email ?? '');
  const [error, setError] = useState('');
  return <Screen>
    <Header title="Care Buddy" onBack={() => navigate('profile')} />
    <Body>Keep a trusted person’s contact here. Care buddies receive alerts, never approval or editing authority.</Body>
    <Body>Contact name</Body><TextInput accessibilityLabel="Care buddy name" value={name} onChangeText={setName} style={styles.input} maxLength={80} />
    <Body>Email</Body><TextInput accessibilityLabel="Care buddy email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Action label="Save contact" onPress={() => {
      if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Enter a name and valid email address.'); return;
      }
      update((current) => ({ ...current, buddy: { name: name.trim(), email: email.trim() } }));
      navigate('profile');
    }} />
    {!!data.buddy && <Action label="Remove contact" onPress={() => {
      update((current) => ({ ...current, buddy: null })); navigate('profile');
    }} />}
    <Body>Demo contact only. Invitations and care-buddy alerts are not connected yet.</Body>
  </Screen>;
}

