import { createClient } from 'npm:@supabase/supabase-js@2';
import { normalizeFood, type Provider } from './normalize.ts';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store' };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return reply({ error: 'Use POST.' }, 405);
  const authorization = request.headers.get('Authorization') ?? '';
  const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !user) return reply({ error: 'Sign in to search food data.' }, 401);
  try {
    const input = await request.json();
    if (!['nutritionix', 'spoonacular'].includes(input.provider)) return reply({ error: 'Choose a food provider.' }, 400);
    const provider: Provider = input.provider;
    const detail = typeof input.id === 'string';
    if (detail ? !/^[a-zA-Z0-9]{1,80}$/.test(input.id) : typeof input.query !== 'string' || input.query.trim().length < 2 || input.query.length > 80) {
      return reply({ error: 'Enter a search of 2–80 characters.' }, 400);
    }
    const quota = await client.rpc('allow_food_lookup');
    if (quota.error) return reply({ error: 'Food lookup setup is incomplete.' }, 503);
    if (!quota.data) return reply({ error: 'Too many searches. Try again in a minute.' }, 429);
    let url: URL; const headers: Record<string, string> = {};
    if (provider === 'nutritionix') {
      const key = Deno.env.get('NUTRITIONIX_APP_KEY'), appId = Deno.env.get('NUTRITIONIX_APP_ID');
      if (!key || !appId) return reply({ error: 'Nutritionix has not been configured yet.' }, 503);
      url = new URL(`https://trackapi.nutritionix.com/v2/search/${detail ? 'item' : 'instant'}`);
      url.searchParams.set(detail ? 'nix_item_id' : 'query', detail ? input.id : input.query.trim());
      if (!detail) { url.searchParams.set('common', 'false'); url.searchParams.set('branded', 'true'); }
      headers['x-app-key'] = key; headers['x-app-id'] = appId;
    } else {
      const key = Deno.env.get('SPOONACULAR_API_KEY');
      if (!key) return reply({ error: 'Spoonacular has not been configured yet.' }, 503);
      url = new URL(`https://api.spoonacular.com/food/menuItems/${detail ? input.id : 'search'}`);
      headers['x-api-key'] = key;
      if (!detail) { url.searchParams.set('query', input.query.trim()); url.searchParams.set('number', '8'); }
    }
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return reply({ error: response.status === 402 || response.status === 429 ? 'Food provider quota reached. Try later.' : 'Food provider is unavailable. Try again later.' }, 502);
    const result = await response.json();
    const foods = provider === 'nutritionix' ? result.foods ?? result.branded ?? [] : detail ? [result] : result.menuItems ?? [];
    return reply({ dishes: foods.slice(0, 8).map((food: unknown) => normalizeFood(provider, food)) });
  } catch { return reply({ error: 'Food lookup failed. Please try again.' }, 502); }
});
