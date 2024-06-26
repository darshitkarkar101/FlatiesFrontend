/**
 * @author : Darshit Karkar
 * @description : TopNavDashboard component
 * @university : University of Regina
 */
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
// import HomeScreen from './HomeScreen';
import HouseLists from './HouseList';
import Explore from './Explore';

const Tab = createMaterialTopTabNavigator();

export default function HouseList() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: route.name,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'House') {
            iconName = 'home-outline';
          } else if (route.name === 'RoomMates') {
            iconName = 'home-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: { backgroundColor: '#fbbf24' },
        tabBarStyle: { paddingTop: insets.top },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HouseLists}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="RoomMates"
        component={Explore}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
