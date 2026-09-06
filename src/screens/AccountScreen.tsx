import { useState } from 'react';
import { Action, Body, Heading, Screen } from '../components/ui';
import { supabase } from '../lib/supabase';

type Props = { email: string; onDemo: () => void };

export function AccountScreen({ email, onDemo }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signOut() {
    if (!supabase || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await supabase.auth.signOut({ scope: 'local' });
      if (result.error) throw result.error;
    } catch {
      setError('Unable to sign out. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <Heading>Welcome to NomNom</Heading>
      <Body>Signed in as {email}</Body>
      <Body>Your account is connected. The meal finder currently uses sample data.</Body>
      {!!error && <Body>{error}</Body>}
      <Action label="Explore sample meals" onPress={onDemo} />
      <Action label={busy ? 'Signing out…' : 'Sign out'} onPress={signOut} disabled={busy} />
    </Screen>
  );
}
