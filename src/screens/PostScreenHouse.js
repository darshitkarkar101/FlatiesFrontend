import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState("");
  const [descriptionBorderColor, setDescriptionBorderColor] = useState("#dcdcdc");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [customTags, setCustomTags] = useState([]);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [predefinedTags, setPredefinedTags] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");

  const areRequiredFieldsFilled = () => {
    return (
      description.trim() !== ""
      // price.trim() !== "" &&
      // address.trim() !== "" &&
      // postalCode.trim() !== "" &&
      // city.trim() !== ""
    );
  };

  const handlePost = async () => {
    if (!areRequiredFieldsFilled()) {
      Alert.alert("Please fill in all required fields.");
      highlightEmptyFields();
      return;
    }

    const postData = {
      uid: "6674b70ff5fafce4f011ec42",
      description: description,
      tag: selectedTags.concat(customTags).map((tag) => tag._id),
      price: price || 2000,
      address: address|| "University of Regina",
      postalCode: postalCode || "No postal code",
      city: city || "regina",
      gender: gender || "other",
    };

    try {
      const response = await axios.post(
        "https://43e6-71-17-39-184.ngrok-free.app/api/v1/post/addPost",
        postData
      );
      console.log("Response from addPost:", response.data);

      Alert.alert("Post submitted successfully!");
      handleCancel();
      navigation.navigate("TabNavDashboard", { screen: "Home" });
      // navigation.goBack(); // Add this line to navigate back
    } catch (error) {
      console.error("Error submitting post:", error);
      Alert.alert("Error submitting post.");
    }
  };

  const highlightEmptyFields = () => {
    if (description.trim() === "") {
      setDescriptionBorderColor("red");
    }
  };

  const handleCancel = () => {
    setDescription("");
    setSelectedTags([]);
    setCustomTags([]);
    setShowNewTagInput(false);
    setSelectedMedia([]);
    setPrice("");
    setAddress("");
    setPostalCode("");
    setCity("");
    setGender("");
    navigation.navigate("TabNavDashboard", { screen: "Home" });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "https://43e6-71-17-39-184.ngrok-free.app/api/v1/tag/getTags"
      );
      setPredefinedTags(response.data.payload.tags);
    } catch (error) {
      // console.error("Error fetching tags:", error);
    }
  };

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1
    });

    if (!result.cancelled) {
      const newSelectedMedia = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type || "image" // Assuming it's an image if type is not available
      }));

      setSelectedMedia([...selectedMedia, ...newSelectedMedia]);
    }
  };

  const removeMedia = (uri) => {
    setSelectedMedia(selectedMedia.filter((item) => item.uri !== uri));
  };

  const handleAddCustomTag = async () => {
    if (newTag.trim()) {
      try {
        const tagData = {
          name: newTag.trim(),
        };

        const response = await axios.post(
          "https://43e6-71-17-39-184.ngrok-free.app/api/v1/tag/addTag",
          tagData
        );
        console.log("Response from addTag:", response.data);

        const newTagId = response.data.payload.newRole._id;
        setCustomTags([...customTags, { _id: newTagId, name: newTag.trim() }]);
        setNewTag("");
        setShowNewTagInput(false);
      } catch (error) {
        console.error("Error adding custom tag:", error);
        Alert.alert("Failed to add custom tag.");
      }
    }
  };
  const toggleTag = (tag) => {
    if (selectedTags.some((t) => t._id === tag._id)) {
      setSelectedTags(selectedTags.filter((t) => t._id !== tag._id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // const removeCustomTag = async (tag) => {
  //   if (tag._id) {
  //     try {
  //       await axios.delete(
  //         `https://43e6-71-17-39-184.ngrok-free.app/api/v1/tag/deleteTag/${tag._id}`
  //       );
  //       setCustomTags(customTags.filter((t) => t._id !== tag._id));
  //     } catch (error) {
  //       console.error("Error deleting custom tag:", error);
  //       Alert.alert("Failed to delete custom tag.");
  //     }
  //   } else {
  //     setCustomTags(customTags.filter((t) => t !== tag));
  //   }
  // };
  const removeCustomTag = (tag) => {
    setCustomTags(customTags.filter((t) => t._id !== tag._id));
  };
  

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.postButton]} onPress={handlePost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
        <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.DescriptionLabel}>Description*</Text>
          <TextInput
            style={[styles.descriptionInput, { borderColor: descriptionBorderColor }]}
            placeholder="Enter description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setDescriptionBorderColor("#dcdcdc");
            }}
            multiline
          />
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Text style={styles.uploadButtonText}>Upload Photos/Videos</Text>
          </TouchableOpacity>
          <ScrollView horizontal style={styles.mediaPreviewContainer}>
            {selectedMedia.map((media, index) => (
              <View key={index} style={styles.mediaPreview}>
                {media.uri && media.type.startsWith("image") ? (
                  <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                ) : (
                  <Icon name="videocam" size={50} color="#000" />
                )}
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeMedia(media.uri)}
                >
                  <Icon name="close-circle" size={20} color="#ff0000" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter postal code"
              value={postalCode}
              onChangeText={setPostalCode}
              // keyboardType="numeric"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === "male" && styles.selectedGender,
              ]}
              onPress={() => setGender(gender === "male" ? "" : "male")}
            >
              <Text style={styles.genderOptionText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === "female" && styles.selectedGender,
              ]}
              onPress={() => setGender(gender === "female" ? "" : "female")}
            >
              <Text style={styles.genderOptionText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === "other" && styles.selectedGender,
              ]}
              onPress={() => setGender(gender === "other" ? "" : "other")}
            >
              <Text style={styles.genderOptionText}>Other</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
          {predefinedTags.map((tag) => (
            <TouchableOpacity
              key={tag._id}
              style={[
                styles.tag,
                selectedTags.some((t) => t._id === tag._id) && styles.selectedTag,
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={styles.tagText}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
          {customTags.map((tag) => (
            <View key={tag._id} style={styles.customTag}>
              <Text style={styles.tagText}>{tag.name}</Text>
              <TouchableOpacity onPress={ ()=> removeCustomTag(tag)}>
                <Icon name="close-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
          
          {!showNewTagInput && (
          <TouchableOpacity onPress={() => setShowNewTagInput(true)}>
            <Text style={styles.addTagButtonText}>Add Tag</Text>
          </TouchableOpacity>
        )}
        {showNewTagInput && (
          <View style={styles.addTagContainer}>
            <TextInput
              style={styles.newTagInput}
              placeholder="Add new tag"
              value={newTag}
              onChangeText={setNewTag}
            />
            <TouchableOpacity onPress={handleAddCustomTag}>
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 15,
    paddingBottom: 80, // Adjusted padding to accommodate bottom buttons
  },
  DescriptionLabel : {
    fontSize: 16,
    marginBottom: 5,
    color: "#000000", // Default label color
  },
  descriptionInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  headerBar: {
    backgroundColor: "#fbbf24",
    height:55,
  },
  // Upload button styles
  uploadButton: {
    backgroundColor: "#00296B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  mediaPreviewContainer: {
    marginBottom: 20,
  },
  mediaPreview: {
    marginRight: 10,
    position: "relative",
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeMediaButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000000", // Default label color
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#000000", // Default label color
  },
  genderOption: {
    backgroundColor: "#fbbf24",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  genderOptionText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  selectedGender: {
    backgroundColor: "#00296B",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  tag: {
    backgroundColor: "#fbbf24",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedTag: {
    backgroundColor: "#e5a812",
  },
  tagText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  customTag: {
    flexDirection: "row",
    backgroundColor: "#00296B",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  addTagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  newTagInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addTagButtonText: {
    backgroundColor: "#fbbf24",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: "#ffffff",
    fontWeight: "bold",
  },
  // Bottom button styles
  bottomButtons: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "white", // Changed to white as requested
  },
  postButton: {
    backgroundColor: "white", // Changed to white as requested
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});


export default App;

