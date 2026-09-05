import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    let active = true;
    let observed = false;
    const { data } = client.auth.onAuthStateChange((_event, next) => {
      observed = true;
      setSession(next);
      setLoading(false);
      setError('');
    });
    client.auth.getSession().then(({ data: result, error: failure }) => {
      if (!active || observed) return;
      setSession(result.session);
      setError(failure?.message ?? '');
      setLoading(false);
    }).catch(() => {
      if (!active || observed) return;
      setError('Unable to restore your session. Please sign in again.');
      setLoading(false);
    });
    const refresh = (state: string) => state === 'active'
      ? client.auth.startAutoRefresh() : client.auth.stopAutoRefresh();
    refresh(AppState.currentState);
    const listener = AppState.addEventListener('change', refresh);
    return () => {
      active = false;
      data.subscription.unsubscribe();
      listener.remove();
      client.auth.stopAutoRefresh();
    };
  }, []);
  return { session, loading, error };
}
