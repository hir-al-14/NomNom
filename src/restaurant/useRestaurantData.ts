import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { restaurantSeed } from './seed';
import type { RestaurantData } from './types';
import { loadOwnedRestaurant } from '../lib/catalog';
import { supabase } from '../lib/supabase';

export function useRestaurantData(userId?: string) {
  const [data, setData] = useState<RestaurantData>(() => userId
    ? { profile: { id: `restaurant:${userId}`, name: '', cuisine: '', address: '', hours: '' }, dishes: [] }
    : restaurantSeed());
  const [ready, setReady] = useState(false);
  const [selectedId, selectRestaurant] = useState<string>();
  const [choices, setChoices] = useState<RestaurantData['profile'][]>([]);
  const [error, setError] = useState('');
  const latest = useRef(data);
  const writes = useRef(Promise.resolve());
  const version = useRef(0);
  const key = `nomnom:restaurant:v1:${userId ?? 'guest'}`;
  useEffect(() => {
    let active = true;
    setReady(false); setError('');
    (userId ? loadOwnedRestaurant(userId, selectedId).then((result) => {
      if (!active) return;
      setChoices(result.choices);
      version.current = result.version; latest.current = result.data; setData(result.data);
    }) : AsyncStorage.getItem(key).then((raw) => {
      if (!active) return;
      if (raw) {
        const saved = JSON.parse(raw);
        if (!saved?.profile || !Array.isArray(saved.dishes)) throw new Error('Invalid restaurant data');
        latest.current = saved; setData(saved);
      }
    })).catch(() => { if (active) setError('Could not load the saved restaurant. Check database setup, then reopen the app.'); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [key, selectedId]);
  async function save(change: (current: RestaurantData) => RestaurantData) {
    if (!ready || error) throw new Error(error || 'Restaurant is still loading.');
    const operation = writes.current.then(async () => {
      const next = change(latest.current);
      if (userId && supabase) {
        const result = await supabase.rpc('save_restaurant_menu', { payload: next, expected_version: version.current });
        if (result.error) throw new Error(result.error.message);
        version.current = result.data;
      } else await AsyncStorage.setItem(key, JSON.stringify(next));
      latest.current = next; setData(next);
    });
    writes.current = operation.catch(() => {});
    return operation;
  }
  return { data, ready, error, save, cloud: !!userId, choices, selectRestaurant };
}
