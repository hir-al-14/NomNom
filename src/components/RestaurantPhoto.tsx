import { Image, View } from 'react-native';
import { Store } from 'lucide-react-native';
import type { Restaurant } from '../domain';
import { restaurantImages } from '../demo/images';
import { DesignPhoto } from './DesignPhoto';

export function RestaurantPhoto({ restaurant, height = 200, width = '100%' }: {
  restaurant: Restaurant; height?: number; width?: number | `${number}%`;
}) {
  const key = restaurant.photo || restaurant.id;
  if (key === 'window') return <DesignPhoto photo="cafe" width={width} height={height} />;
  const source = restaurantImages[key];
  return source ? <Image source={source} accessibilityLabel={restaurant.name} resizeMode="cover"
    style={{ width, height, borderRadius: 12 }} /> : <View style={{ width, height, borderRadius: 12,
      backgroundColor: '#E1EEF0', alignItems: 'center', justifyContent: 'center' }}><Store size={32} color="#4D8194" /></View>;
}
