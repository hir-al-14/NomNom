import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { restaurantSeed } from './seed';
import type { RestaurantData } from './types';

export function useRestaurantData(userId?: string) {
  const [data, setData] = useState(restaurantSeed);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const latest = useRef(data);
  const writes = useRef(Promise.resolve());
  const key = `nomnom:restaurant:v1:${userId ?? 'guest'}`;
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key).then((raw) => {
      if (!active) return;
      if (raw) {
        const saved = JSON.parse(raw);
        if (!saved?.profile || !Array.isArray(saved.dishes)) throw new Error('Invalid restaurant data');
        latest.current = saved; setData(saved);
      }
    }).catch(() => { if (active) setError('Could not load the saved restaurant. Reopen the app to retry.'); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [key]);
  async function save(change: (current: RestaurantData) => RestaurantData) {
    if (!ready || error) throw new Error(error || 'Restaurant is still loading.');
    const operation = writes.current.then(async () => {
      const next = change(latest.current);
      await AsyncStorage.setItem(key, JSON.stringify(next));
      latest.current = next; setData(next);
    });
    writes.current = operation.catch(() => {});
    return operation;
  }
  return { data, ready, error, save };
}
