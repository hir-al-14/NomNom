import { useState } from 'react';
import type { AccountType } from '../components/AccountTypeSelector';
import { supabase } from '../lib/supabase';

export function useEmailAuth(accountType: AccountType) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit() {
    if (busy) return;
    if (!supabase) {
      setMessage('Sign-in is unavailable in this build. You can still try the demo.');
      return;
    }
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) || !password) {
      setMessage('Enter a valid email address and your password.');
      return;
    }
    if (creating && password.length < 8) {
      setMessage('Choose a password with at least 8 characters.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const result = creating
        ? await supabase.auth.signUp({
          email: address, password, options: { data: { account_type: accountType } },
        })
        : await supabase.auth.signInWithPassword({ email: address, password });
      if (result.error) throw result.error;
      setPassword('');
      if (creating && !result.data.session) {
        setMessage('Check your email to confirm your account, then return here to log in.');
        setCreating(false);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  function toggleMode() {
    setCreating(!creating);
    setPassword('');
    setMessage('');
  }
  return { email, setEmail, password, setPassword, creating, busy, message, submit, toggleMode };
}
