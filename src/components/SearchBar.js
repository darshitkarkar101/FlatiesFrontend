import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ searchText, onSearch }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const applyFilters = () => {
    console.log(`Location: ${location}, Gender: ${gender}`);
    setIsFilterVisible(false);
  };

  const selectGender = (selectedGender) => {
    if (gender === selectedGender) {
      setGender('');
    } else {
      setGender(selectedGender);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          onChangeText={onSearch}
          value={searchText}
        />
        <TouchableOpacity onPress={toggleFilterVisibility} style={styles.filterIcon}>
          <Icon name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {isFilterVisible && (
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Location"
            onChangeText={setLocation}
            value={location}
          />
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'male' && styles.genderButtonSelected,
              ]}
              onPress={() => selectGender('male')}
            >
              <Text style={styles.genderButtonText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'female' && styles.genderButtonSelected,
              ]}
              onPress={() => selectGender('female')}
            >
              <Text style={styles.genderButtonText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'other' && styles.genderButtonSelected,
              ]}
              onPress={() => selectGender('other')}
            >
              <Text style={styles.genderButtonText}>Other</Text>
            </TouchableOpacity>
          </View>
          <Button title="Apply Filters" onPress={applyFilters} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    topMargin: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    padding: 10,
    borderRadius: 10,
  },
  filterIcon: {
    padding: 5,
  },
  filterContainer: {
    marginTop: 15,
  },
  filterInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#dcdcdc',
    borderColor: '#000',
  },
  genderButtonText: {
    fontSize: 16,
  },
});

export default SearchBar;
