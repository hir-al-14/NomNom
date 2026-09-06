import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { loadCatalog } from '../lib/catalog';
import type { Dish, Restaurant } from '../domain';

export function useCatalogData(userId?: string, revision?: unknown) {
  const [catalog, setCatalog] = useState<{ restaurants: Restaurant[]; dishes: Dish[] }>({ restaurants: [], dishes: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    if (!userId) return;
    let active = true; let loading = false;
    async function refresh() {
      if (loading || AppState.currentState !== 'active') return;
      loading = true;
      try { const next = await loadCatalog(); if (active) { setCatalog(next); setError(''); } }
      catch (failure) { if (active) setError(failure instanceof Error ? failure.message : 'Could not load restaurants.'); }
      finally { loading = false; }
    }
    refresh();
    const timer = setInterval(refresh, 15000);
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') refresh(); });
    return () => { active = false; clearInterval(timer); subscription.remove(); };
  }, [userId, revision]);
  return { ...catalog, error };
}
