import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ searchText, onSearch, onFiltersChange }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const [selectedType, setSelectedType] = useState('House'); // Default to House

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const applyFilters = () => {
    const filters = {
      location,
      gender,
      selectedType,
    };
    onFiltersChange(filters); // Pass filters to parent component (HouseLists)
    setIsFilterVisible(false);
  };

  const handleSearch = (text) => {
    onSearch(text); // Pass search text to parent component (HouseLists)
    if (selectedType === 'House') {
      const filters = {
        location,
        gender,
        selectedType,
      };
      onFiltersChange(filters); // Pass filters to parent component (HouseLists)
    }
  };

  const selectGender = (selectedGender) => {
    setGender(gender === selectedGender ? '' : selectedGender);
  };

  const selectType = (type) => {
    setSelectedType(type);
  };

  return (
    <View style={[styles.container, isFilterVisible && styles.containerWithBorder]}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          onChangeText={handleSearch}
          value={searchText}
          onSubmitEditing={() => handleSearch(searchText)} // Trigger search on enter
        />
        <TouchableOpacity onPress={toggleFilterVisibility} style={styles.filterIcon}>
          <Icon name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {isFilterVisible && (
        <View style={styles.filterContainer}>
          <View style={styles.filterBox}>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'House' && styles.typeButtonSelected,
                ]}
                onPress={() => selectType('House')}
              >
                <Text style={styles.typeButtonText}>House</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'Roommates' && styles.typeButtonSelected,
                ]}
                onPress={() => selectType('Roommates')}
              >
                <Text style={styles.typeButtonText}>Roommates</Text>
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 0,
  },
  containerWithBorder: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    paddingBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  filterIcon: {
    padding: 5,
  },
  filterContainer: {
    marginTop: 10,
  },
  filterBox: {
    padding: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  typeButtonText: {
    fontSize: 16,
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
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  genderButtonText: {
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchBar;
