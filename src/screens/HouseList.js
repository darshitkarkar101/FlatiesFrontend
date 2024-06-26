import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import TopNavBar from '../components/TopNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';

const HouseLists = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState('House');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    gender: '',
    selectedType: 'House',
  });

  const fetchProperties = () => {
    setLoading(true);
    let apiUrl = '';

    if (selectedTab === 'House') {
      apiUrl = `https://43e6-71-17-39-184.ngrok-free.app/api/v1/post/getPost?gender=${filters.gender}&location=${filters.location}`;
    } else if (selectedTab === 'Roommates') {
      apiUrl = `https://43e6-71-17-39-184.ngrok-free.app/api/v1/roommate/getRoommate?gender=${filters.gender}&location=${filters.location}`;
    }

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.payload && data.payload.post && data.payload.post.length > 0) {
          const backendProperties = data.payload.post.map((backendProperty) => ({
            id: backendProperty._id,
            image: backendProperty.image && backendProperty.image.length > 0 ? backendProperty.image[0].media : 'https://placeholder.com/200x300',
            price: backendProperty.price || '$300,000',
            city: backendProperty.city || '',
            gender: backendProperty.gender || 'Male',
            description: backendProperty.description || 'No description available',
            address: backendProperty.address || 'No description available',
            squareMeters: backendProperty.squareMeters || '180',
            tags: Array.isArray(backendProperty.tag) ? backendProperty.tag.map(tag => tag.name) : [],
          }));
          setProperties(backendProperties);
          setError(null);
        } else {
          setProperties([]);
          setError('No properties found');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch properties');
        setProperties([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchProperties();
    }
  }, [isFocused, selectedTab, filters]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedTab(newFilters.selectedType); // Update the selected tab based on filter selection
  };

  const navigateToPropertyDetail = (item) => {
    if (selectedTab === 'House') {
      navigation.navigate('HouseDetail', { propertyId: item.id });
    } else if (selectedTab === 'Roommates') {
      navigation.navigate('RoommateDetail', { propertyId: item.id });
    }
  };

  const renderTags = (tags) => {
    if (!Array.isArray(tags)) return null;
    return tags.map((tag, index) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigateToPropertyDetail(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardDetails}>
        <View style={styles.leftColumn}>
          <Text style={styles.description}>{item?.address} {item?.city}</Text>
          <Text style={styles.address}>{item.gender}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.price}>${item.price} CAD</Text>
          <Text style={styles.squareMeters}>{item.squareMeters} sq. m.</Text>
        </View>
      </View>
      <Text style={styles.description2}>{item.description}</Text>
      <View style={styles.cardFooter}>
        {renderTags(item.tags)}
      </View>
    </TouchableOpacity>
  );

  const filteredData = properties.filter((item) => {
    return item.address.toLowerCase().includes(searchText.toLowerCase());
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        onSearch={handleSearch}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <TopNavBar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <FlatList
        contentContainerStyle={styles.propertyListContainer}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyListContainer: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  description: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
  },
  description2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  address: {
    fontSize: 12,
    color: '#555',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00296B',
    marginBottom: 8,
  },
  squareMeters: {
    fontSize: 12,
    color: '#888',
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 12, // Adjusted padding to make tags more compact
    paddingVertical: 6, // Adjusted padding to make tags more compact
    marginVertical: 4, // Reduced vertical margin for tighter packing
    marginRight: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
  },
});

export default HouseLists;