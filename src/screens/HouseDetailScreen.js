import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import MapView, { Marker, Circle } from "react-native-maps";

const ProductDetailView = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // Track active image index
  const [showFullDescription, setShowFullDescription] = useState(false); // State to toggle full description
  const [region, setRegion] = useState(null); // State to store map region
  const [contactDescription, setContactDescription] = useState(""); // State to store contact description
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { propertyId } = route.params;

  useEffect(() => {
    fetchDataFromBackend(propertyId)
      .then((data) => {
        setProductData(data);
        fetchCoordinates(data.address, data.city, data.postalCode); // Fetch coordinates using address, city, or postal code
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setMockData();
        setLoading(false);
      });
  }, [propertyId]);

  const fetchDataFromBackend = async (id) => {
    try {
      const response = await fetch(
        `https://43e6-71-17-39-184.ngrok-free.app/api/v1/post/getPost?id=${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      if (
        data.result === 0 &&
        data.payload &&
        data.payload.post &&
        data.payload.post.length > 0
      ) {
        return data.payload.post[0];
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  };

  const setMockData = () => {
    // Define your mock data here
    const mockProductData = {
      description: "This is a mock product description.",
      price: "$300,000", // Constant price as per your requirement
      tags: [{ name: "No Smoking" }, { name: "No Drinking" }],
      contactMethod: {
        email: "abc@gmail.com",
      },
      image: [
        {
          media: "https://picsum.photos/id/1/200/300",
        },
      ],
      address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA", // Mock address
      city: "Mountain View", // Mock city
      postalCode: "94043", // Mock postal code
    };
    setProductData(mockProductData);
    fetchCoordinates(
      mockProductData.address,
      mockProductData.city,
      mockProductData.postalCode
    ); // Fetch coordinates for mock data
  };

  const fetchCoordinates = async (address, city, postalCode) => {
    try {
      let query = address || ""; // Initialize with address
      if (!query && city) {
        query = city; // Use city if address is not available
      } else if (!query && postalCode) {
        query = postalCode; // Use postal code if neither address nor city is available
      }

      if (query) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURI(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch coordinates");
        }
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0]; // Assuming the first result is the most relevant
          setRegion({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        } else {
          throw new Error("Coordinates not found");
        }
      } else {
        throw new Error("Query is empty");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setError("Failed to fetch coordinates");
    }
  };

  const renderImage = ({ item }) => (
    <Image style={styles.image} source={{ uri: item.media }} />
  );

  const handlePageChange = (index) => {
    setActiveIndex(index);
  };

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleContactSubmit = () => {
    // Handle contact description submit logic here
    console.log("Contact description:", contactDescription);
    setSubmittedSuccessfully(true);

    // You can clear the input after submission if needed
    setContactDescription("");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !productData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text>Error fetching product details. Using mock data.</Text>
        <Button
          title="Retry"
          onPress={() => fetchDataFromBackend(propertyId)}
        />
      </View>
    );
  }

  // Assuming the address is available in productData
  const address = productData?.address ? `${productData.address}` : "";
  const city = productData?.city ? `, ${productData.city}` : "";
  const postalCode = productData?.postalCode
    ? `, ${productData.postalCode}`
    : "";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {productData.image && (
          <FlatList
            data={productData.image}
            renderItem={renderImage}
            horizontal
            pagingEnabled
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(
                event.nativeEvent.contentOffset.x / wp(100)
              );
              setActiveIndex(newIndex);
            }}
          />
        )}
      </View>
      {productData.image && (
        <View style={styles.indicatorContainer}>
          {productData.image.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                index === activeIndex && styles.activeIndicator,
              ]}
              onPress={() => handlePageChange(index)}
            />
          ))}
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name}>{productData.description}</Text>
        <Text style={styles.price}>${productData.price}</Text>
        <View style={styles.tagsContainer}>
          {productData.tag &&
            productData.tag.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
        </View>
        <Text style={styles.description}>
          {showFullDescription
            ? productData.description+`...  `
            : `${productData.description.slice(0, 120)}...  `}
          <Text style={styles.readMore} onPress={handleToggleDescription}>
            Read {showFullDescription ? "Less" : "More"}
          </Text>
        </Text>
        <View style={styles.addressMethod}>
          <Text style={styles.contactMethodTitle}>Address:</Text>
          <Text style={styles.contactMethodText}>
            {address}
            {city}
            {postalCode}
          </Text>
        </View>
        {/* Render MapView if region is set */}
        {region && (
          <MapView
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
          >
            <Circle
              center={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              radius={700} // 1 km radius
              fillColor="rgba(255, 0, 0, 0.5)" // Red color with 50% opacity
              strokeColor="transparent"
            />
          </MapView>
        )}
        <View style={styles.contactForm}>
          <Text style={styles.contactFormTitle}>Contact Me</Text>
          <TextInput
            style={styles.contactDescriptionInput}
            multiline
            placeholder="Enter your message"
            value={contactDescription}
            onChangeText={setContactDescription}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleContactSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {submittedSuccessfully && (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessage}>
                Your query has been submitted successfully. The owner will
                respond to you shortly. Thank you!
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    height: hp(40),
  },
  image: {
    width: wp(100),
    height: hp(40),
    resizeMode: "cover",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: hp(2),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#fbbf24",
  },
  backButton: {
    position: "absolute",
    top: hp(2),
    left: wp(2),
    zIndex: 1,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
  },
  info: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  name: {
    fontSize: hp(3),
    fontWeight: "bold",
    marginBottom: hp(1),
  },
  price: {
    fontSize: hp(3),
    color: "#00296B",
    marginBottom: hp(1),
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: hp(1),
  },
  tag: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: hp(1.8),
    color: "#2d3748",
  },
  description: {
    fontSize: hp(2),
    lineHeight: hp(2.5),
    marginBottom: hp(2),
  },
  readMore: {
    color: "#fbbf24",
    fontWeight: "bold",

    textDecorationLine: "underline",
  },
  addressMethod: {
    marginBottom: hp(2),
  },
  contactMethodTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  contactMethodText: {
    fontSize: hp(2),
  },
  map: {
    height: hp(30),
    marginTop: hp(2),
  },
  contactInfo: {
    marginTop: hp(2),
  },
  contactInfoTitle: {
    fontWeight: "bold",
    fontSize: hp(2),
    marginBottom: hp(1),
  },
  contactEmail: {
    fontSize: hp(2),
    marginBottom: hp(1),
  },
  contactFormTitle: {
    fontWeight: "bold",
    fontSize: hp(2),
    marginBottom: hp(1),
  },
  contactForm: {
    marginTop: hp(2),
  },
  contactDescriptionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: hp(1),
    fontSize: hp(2),
    minHeight: hp(20), // Adjust the minimum height as per your design
    textAlignVertical: "top", // Ensures text starts from top in multiline
  },
  submitButton: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    bottom: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: hp(2),
    fontWeight: "bold",
  },
  successMessageContainer: {
  backgroundColor: '#d1e7dd',
  padding: 10,
  marginVertical: 10,
  borderRadius: 5,
},
successMessage: {
  fontSize: 16,
  color: '#13523b',
  textAlign: 'center',
},
};

export default ProductDetailView;
