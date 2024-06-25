import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import HouseLists from './HouseList';
import UserProfile from './editProfile';
import Explore from './Explore';
import Notification from './NotificationScreen';
import TabBar from '../components/TabBar';
import LogOutScreen from './LogOutScreen'; // Correct import path
import PostBar from '../components/PostBar'; // Correct import path
import { View, StyleSheet, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const Tab = createBottomTabNavigator();

const TabNavDashboard = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // Hook to access navigation object
  const [postBarVisible, setPostBarVisible] = useState(false); // State to control PostBar visibility
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track keyboard visibility

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const togglePostBar = () => {
    // Toggle PostBar visibility
    setPostBarVisible((prevVisible) => !prevVisible);
  };

  const handleClosePostBar = () => {
    // Close PostBar when cancel button is clicked
    setPostBarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => !keyboardVisible && <TabBar {...props} />} // Hide TabBar when keyboard is visible
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarLabel: route.name,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Explore') {
              iconName = 'search-outline';
            } else if (route.name === 'Post') {
              iconName = 'add-circle-outline';
            } else if (route.name === 'UserProfile') {
              iconName = 'notifications-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HouseLists}
          options={{ tabBarActiveTintColor: '#fbbf24', headerShown: false }}
        />
        <Tab.Screen
          name="Post"
          component={HouseLists} // Use any component, it will be overridden by custom UI
          listeners={{
            tabPress: () => {
              // Toggle PostBar visibility
              togglePostBar();
            },
          }}
          options={{ tabBarActiveTintColor: '#fbbf24', headerShown: false }}
        />
        {/* <Tab.Screen
          name="Explore"
          component={Explore}
          options={{ tabBarActiveTintColor: '#fbbf24', headerShown: false }}
        /> */}
        <Tab.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ tabBarActiveTintColor: '#fbbf24', headerShown: false }}
        />
      </Tab.Navigator>

      {/* Render PostBar over other screens when postBarVisible is true */}
      {postBarVisible && (
        <View style={styles.postBarContainer}>
          <PostBar
            onCloseModal={handleClosePostBar}
            onHousePost={() => {
              // Navigate to PostHouse screen
              navigation.navigate('PostScreenHouse'); // Assuming 'PostHouse' is properly set up in your navigation
              handleClosePostBar();
            }}
            onRoommatePost={() => {
              // Implement logic for finding roommates
              console.log('Find roommates logic');
              handleClosePostBar();
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust as per your app's theme
  },
  postBarContainer: {
    position: 'absolute',
    bottom: 0, // Adjust this value as needed to position the PostBar above the tab bar
    left: 0,
    right: 0,
    zIndex: 999, // Ensure the PostBar is above the tab bar
    alignItems: 'center',
  },
});

export default TabNavDashboard;
