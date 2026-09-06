import { useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import { Header } from '../components/Primitives';
import { Body, Screen } from '../components/ui';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function EditRestaurantProfile() {
  const { store, navigate } = useOwner();
  const [profile, setProfile] = useState(store.data.profile);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save() {
    if (busy) return;
    if (!profile.name.trim()) { setError('Enter your restaurant name.'); return; }
    setBusy(true);
    try {
      await store.save((current) => ({ ...current, profile: { ...profile, name: profile.name.trim() } }));
      navigate('profile');
    } catch { setError('Could not save. Please try again.'); } finally { setBusy(false); }
  }
  return <Screen>
    <Header title="Edit restaurant" onBack={() => { if (!busy) navigate('profile'); }} />
    {([{ key: 'name', label: 'Restaurant name' }, { key: 'cuisine', label: 'Cuisine' },
      { key: 'address', label: 'Address' }, { key: 'hours', label: 'Opening hours' }] as const).map(({ key, label }) => <TextField key={key}
        label={label} value={profile[key]} disabled={busy} onChange={(value) => setProfile({ ...profile, [key]: value })} />)}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Pressable accessibilityRole="button" disabled={busy} onPress={save} style={s.button}><Text style={s.buttonText}>{busy ? 'Saving…' : 'Save changes'}</Text></Pressable>
  </Screen>;
}

export function TextField({ label, value, onChange, disabled = false }: {
  label: string; value: string; onChange: (value: string) => void; disabled?: boolean;
}) {
  return <><Body>{label}</Body><TextInput accessibilityLabel={label} value={value} onChangeText={onChange}
    editable={!disabled} maxLength={200} style={s.input} /></>;
}
