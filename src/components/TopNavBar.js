import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

const TopNavBar = ({ selectedTab, onSelectTab }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navItem, selectedTab === 'House' && styles.selectedNavItem]}
        onPress={() => onSelectTab('House')}
      >
        <Image source={require('../assets/home.png')} style={styles.navIcon} />
        <Text style={[styles.navText, selectedTab === 'House' && styles.selectedNavText]}>Houses</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[styles.navItem, selectedTab === 'Roommates' && styles.selectedNavItem]}
        onPress={() => onSelectTab('Roommates')}
      >
        <Image source={require('../assets/people.png')} style={styles.navIcon} />
        <Text style={[styles.navText, selectedTab === 'Roommates' && styles.selectedNavText]}>Roommates</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#dcdcdc',
    marginHorizontal: 10,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedNavItem: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  selectedNavText: {
    color: '#fff',
  },
});

export default TopNavBar;
