export type Provider = 'nutritionix' | 'spoonacular';
export function normalizeFood(provider: Provider, item: any) {
  const id = String(provider === 'nutritionix' ? item.nix_item_id : item.id);
  const name = provider === 'nutritionix' ? item.food_name : item.title;
  const brand = provider === 'nutritionix' ? item.brand_name || item.nix_brand_name : item.restaurantChain;
  const image = provider === 'nutritionix' ? item.photo?.highres || item.photo?.thumb : item.image;
  const nutrients = item.nutrition?.nutrients ?? [];
  const amount = (key: string, field: string) => {
    const value = provider === 'nutritionix' ? item[field] : nutrients.find((n: any) => n.name === key)?.amount;
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? String(value) : '';
  };
  return { id: `api:${provider}:${id}`, externalId: id, source: provider,
    restaurantId: `api:${provider}:${encodeURIComponent(brand || 'Food database')}`,
    restaurantName: brand || 'Food database', name: String(name || 'Unnamed item'),
    description: `${provider === 'nutritionix' ? 'Nutritionix' : 'Spoonacular'} food data. Restaurant preparation may differ.`,
    imageUrl: typeof image === 'string' && image.startsWith('https://') ? image : undefined,
    priceCents: 0, ingredients: typeof item.nf_ingredient_statement === 'string' ? [item.nf_ingredient_statement] : [],
    // These endpoints do not establish complete allergen or cross-contact information.
    flags: [], complete: false,
    nutrition: { carbs: amount('Carbohydrates', 'nf_total_carbohydrate'), protein: amount('Protein', 'nf_protein'),
      calories: amount('Calories', 'nf_calories'), fat: amount('Fat', 'nf_total_fat') },
  };
}
