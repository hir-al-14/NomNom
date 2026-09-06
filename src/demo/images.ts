import type { ImageSourcePropType } from 'react-native';

export const restaurantImages: Record<string, ImageSourcePropType> = {
  'demo-kitchen': require('../../assets/restaurant-cava.png'),
  luigino: require('../../assets/restaurant-luigino.png'),
  sokyo: require('../../assets/restaurant-sokyo.png'),
  window: require('../../assets/restaurant-window.png'),
};

export const dishImages: Record<string, ImageSourcePropType> = {
  'rice-bowl': require('../../assets/chicken-bowl.png'),
  'tomato-soup': require('../../assets/greek-bowl.png'),
  'avocado-toast': require('../../assets/falafel-pita.png'),
  'seasonal-special': require('../../assets/pita-bread.png'),
};
