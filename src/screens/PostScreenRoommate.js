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
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";

const App = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState("");
  const [descriptionBorderColor, setDescriptionBorderColor] = useState("#dcdcdc"); // Added state
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
      description.trim() !== "" &&
      // selectedTags.length > 0 &&
      price.trim() !== "" &&
      address.trim() !== "" &&
      postalCode.trim() !== "" &&
      city.trim() !== "" 
      // gender.trim() !== ""
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
      price: price,
      address: address,
      postalCode: postalCode,
      city: city,
      gender: gender,
    };

    try {
      const response = await axios.post(
        "http://172.16.1.69:3009/api/v1/post/addPost",
        postData
      );
      console.log("Response from addPost:", response.data);

      Alert.alert("Post submitted successfully!");
      handleCancel();
      navigation.navigate("TabNavDashboard", { screen: "Home" });
    } catch (error) {
      console.error("Error submitting post:", error);
      Alert.alert("Error submitting post.");
    }
  };

  const highlightEmptyFields = () => {
    if (description.trim() === "") {
      setDescriptionBorderColor("red");
    }
    if (selectedTags.length === 0) {
      console.log("No tags selected");
    }
    // Repeat for other fields as needed
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
        "http://172.16.1.69:3009/api/v1/tag/getTags"
      );
      setPredefinedTags(response.data.payload.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleUpload = () => {
    launchImageLibrary(
      {
        mediaType: "mixed",
        selectionLimit: 0,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setSelectedMedia(response.assets);
        }
      }
    );
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
          "http://172.16.1.69:3009/api/v1/tag/addTag",
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

  const removeCustomTag = async (tag) => {
    if (tag._id) {
      try {
        await axios.delete(
          `http://172.16.1.69:3009/api/v1/tag/deleteTag/${tag._id}`
        );
        setCustomTags(customTags.filter((t) => t._id !== tag._id));
      } catch (error) {
        console.error("Error deleting custom tag:", error);
        Alert.alert("Failed to delete custom tag.");
      }
    } else {
      setCustomTags(customTags.filter((t) => t !== tag));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.bottomButtons}>
          <Button style={styles.backButton} title="Cancel" onPress={handleCancel} />
          <Button title="Post" onPress={handlePost} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={[styles.descriptionInput, { borderColor: descriptionBorderColor }]}
          placeholder="Enter description*"
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
          {selectedMedia.map((media) => (
            <View key={media.uri} style={styles.mediaPreview}>
              {media.type.startsWith("image") ? (
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
          <Text style={styles.label}>Price*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price*"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address*"
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Postal Code*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter postal code*"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>City*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city*"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>Gender*</Text>
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
              <TouchableOpacity onPress={() => removeCustomTag(tag)}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
    paddingBottom: 80, // Adjusted padding to accommodate bottom buttons
  },
  descriptionInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  headerBar: {
    backgroundColor: "#fbbf24",
    height: 50,
  },
  uploadButton: {
    backgroundColor: "#fbbf24",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
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
    backgroundColor: "#e5a812",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
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
    backgroundColor: "#fbbf24",
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
  bottomButtons: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default App;

