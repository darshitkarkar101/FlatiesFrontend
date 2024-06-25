// /**
//  * @author : Darshit Karkar
//  * @description : Explore component
//  * @university : University of Regina
//  */
// import { View, Text, ScrollView, Image, TextInput } from "react-native";
// import React, { useEffect, useState } from "react";
// import { StatusBar } from "expo-status-bar";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
// import Categories from "../components/categories";
// import axios from "axios";
// import ExploreNewRecipes from "../components/ExploreNew";
// export default function HomeScreen() {
//   const [activeCategory, setActiveCategory] = useState("Beef");
//   const [categories, setCategories] = useState([]);
//   const [meals, setMeals] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     getCategories();
//     getRecipes();
//   }, []);

//   const handleChangeCategory = (category) => {
//     getRecipes(category);
//     setActiveCategory(category);
//     setMeals([]);
//   };

//   const getCategories = async () => {
//     try {
//       const response = await axios.get(
//         "https://themealdb.com/api/json/v1/1/categories.php"
//       );
//       // console.log('got categories: ',response.data);
//       if (response && response.data) {
//         setCategories(response.data.categories);
//       }
//     } catch (err) {
//       console.log("error: ", err.message);
//     }
//   };
//   const getRecipes = async (category = "seafood") => {
//     try {
//       const response = await axios.get(
//         `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
//       );
//       // console.log('got recipes: ',response.data);
//       if (response && response.data) {
//         setMeals(response.data.meals);
//       }
//     } catch (err) {
//       console.log("error: ", err.message);
//     }
//   };
//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(
//         `https://themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
//       );
//       if (response && response.data && response.data.meals) {
//         const searchedMeals = response.data.meals;
//         setMeals(searchedMeals.length > 0 ? searchedMeals : []);
//       } else {
//         // No data available
//         setMeals([]);
//       }
//     } catch (err) {
//       console.log("error: ", err.message);
//       // Handle the error, you can display an error message or log it
//       // For now, setting meals to an empty array
//       setMeals([]);
//     }
//   };
//   return (
//     <View className="flex-1 bg-white">
//       <StatusBar style="dark" />
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 50 }}
//         className="space-y-6 pt-14"
//       >
//         {/* avatar and bell icon */}
//         {/* <View className="mx-4 flex-row justify-between items-center mb-2">
//           <Image source={require('../../assets/images/avatar.png')} style={{height: hp(5), width: hp(5.5)}} />
//           <BellIcon size={hp(4)} color="gray" />
//         </View> */}

//         {/* greetings and punchline */}
//         {/* <View className="mx-4 space-y-2 mb-2">
//           <Text style={{fontSize: hp(1.7)}} className="text-neutral-600">Hello, Noman!</Text>
//           <View>
//             <Text style={{fontSize: hp(3.8)}} className="font-semibold text-neutral-600">Make your own food,</Text>
//           </View>
//           <Text style={{fontSize: hp(3.8)}} className="font-semibold text-neutral-600">
//             stay at <Text className="text-amber-400">home</Text>
//           </Text>
//         </View> */}

//         {/* search bar */}
//         <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
//           <TextInput
//             placeholder="Search any recipe"
//             placeholderTextColor="gray"
//             style={{ fontSize: hp(1.7) }}
//             className="flex-1 text-base mb-1 pl-3 tracking-wider"
//             value={searchQuery}
//             onChangeText={(text) => setSearchQuery(text)}
//           />
//           <View className="bg-white rounded-full p-3" onTouchEnd={handleSearch}>
//             <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
//           </View>
//         </View>

//         {/* categories */}
//         {/* <View>
//           { categories.length>0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} /> }
//         </View> */}

//         {/* recipes */}
//         <View>
//           <ExploreNewRecipes meals={meals} categories={categories} />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import TopNavBar from '../components/TopNavBar';
import { useFocusEffect } from '@react-navigation/native';

const RoommatesLists = () => {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState('House');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = () => {
    setLoading(true);
    fetch('http://172.16.1.69:3009/api/v1/roommate/getRoommate')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log('Data:', data.payload.post);
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
    fetchProperties();
  }, [selectedTab]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProperties();
    }, [])
  );

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const navigateToPropertyDetail = (item) => {
    navigation.navigate('RecipeDetail', { propertyId: item.id });
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
        {/* Left side: Description and Address */}
        <View style={styles.leftColumn}>
          <Text style={styles.description}>{item?.address} {item?.city}</Text>
          <Text style={styles.address}>{item.gender}</Text>
        </View>
        {/* Right side: Price and Square Meters */}
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
      <SearchBar searchText={searchText} onSearch={handleSearch} />
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
    marginBottom: 8,
    
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
    color: '#6200ee',
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

export default RoommatesLists;
