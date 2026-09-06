import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { readActivity } from '../lib/activity';

export function useActivity(enabled: boolean, customerId?: string, restaurantId?: string) {
  const [data, setData] = useState<Awaited<ReturnType<typeof readActivity>>>({ messages: [], orders: [] });
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let active = true; let loading = false;
    async function refresh() {
      if (loading || AppState.currentState !== 'active') return;
      loading = true;
      try { const result = await readActivity({ customerId, restaurantId }); if (active) { setData(result); setError(''); } }
      catch (failure) { if (active) setError(failure instanceof Error ? failure.message : 'Could not sync activity.'); }
      finally { loading = false; }
    }
    refresh(); const timer = setInterval(refresh, 5000);
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') refresh(); });
    return () => { active = false; clearInterval(timer); subscription.remove(); };
  }, [enabled, customerId, restaurantId, revision]);
  return { ...data, error, refresh: () => setRevision((current) => current + 1) };
}
