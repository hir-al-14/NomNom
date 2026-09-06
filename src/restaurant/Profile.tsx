import { menuSections } from '../domain';
import { ArrowRight, Settings, SquarePen } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DishPhoto } from '../components/DishPhoto';
import { RestaurantPhoto } from '../components/RestaurantPhoto';
import { IconButton } from '../components/Primitives';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function OwnerProfile() {
  const { store: { data, cloud }, navigate } = useOwner();
  const insets = useSafeAreaInsets();
  return <ScrollView style={s.page}>
    <StatusBar style="light" />
    <RestaurantPhoto restaurant={data.profile} />
    <View style={[s.heroHeader, { top: insets.top }]}>
      <IconButton Icon={Settings} label="Restaurant settings" color="white" onPress={() => navigate('settings')} />
      <Text style={s.heroTitle}>Profile</Text>
      <IconButton Icon={SquarePen} label="Edit restaurant" color="white" onPress={() => navigate('editProfile')} />
    </View>
    <View style={s.content}>
      <Text style={s.name}>{data.profile.name || 'Your restaurant'}</Text><Text style={s.subtitle}>{data.profile.cuisine}</Text>
      <Text style={[s.small, { textAlign: 'center' }]}>{data.profile.address}</Text>
      <View style={[s.row, { justifyContent: 'center' }]}>
        {[cloud ? 'Restaurant menu' : 'Demo restaurant', data.profile.hours].filter(Boolean).map((label) => <View key={label} style={s.chip}><Text style={s.small}>{label}</Text></View>)}
      </View>
      <View style={s.divider} />
      <View style={s.row}><Text style={s.title}>Menu items</Text>
        <Pressable accessibilityRole="button" onPress={() => navigate(data.profile.name.trim() ? 'dish' : 'editProfile', 'new')} style={{ paddingVertical: 12 }}><Text style={s.link}>+ Add dish</Text></Pressable>
      </View>
      {menuSections(data.dishes).map((section) => <View key={section.category} style={{ gap: 12 }}>
        <Text style={s.title}>{section.category}</Text>
        {section.dishes.map((dish) => <Pressable key={dish.id} accessibilityRole="button" accessibilityLabel={`Edit ${dish.name}`}
        style={s.menuRow} onPress={() => navigate('dish', dish.id)}>
        <DishPhoto dish={dish} width={88} height={88} />
        <Text style={s.menuName}>{dish.name}</Text>
        <View style={s.arrow}><ArrowRight size={17} color="white" /></View>
      </Pressable>)}</View>)}
      {!data.dishes.length && <Text style={s.small}>Add your first dish to start your menu.</Text>}
    </View>
  </ScrollView>;
}
