import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

const TopNavBar = ({ selectedTab, onSelectTab }) => {
  return (
    <View style={styles.navbar}>
      <View style={styles.navItems}>
        <TouchableOpacity
          style={[styles.navItem, selectedTab === 'House' && styles.selectedNavItem]}
          onPress={() => onSelectTab('House')}
        >
          <Image source={require('../assets/home.png')} style={styles.navIcon} />
          <Text style={[styles.navText, selectedTab === 'House' && styles.selectedNavText]}>House</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, selectedTab === 'Roommates' && styles.selectedNavItem]}
          onPress={() => onSelectTab('Roommates')}
        >
        <Image source={require('../assets/people.png')} style={styles.navIcon} />
          <Text style={[styles.navText, selectedTab === 'Roommates' && styles.selectedNavText]}>Roommates</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  navItems: {
    flexDirection: 'row',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingBottom: 5,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  selectedNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  selectedNavText: {
    color: 'blue',
  },
});

export default TopNavBar;
