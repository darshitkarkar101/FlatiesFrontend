import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Button from "../components/Button";
import { theme } from "../core/theme";

export default function Board1({ navigation }) {
  const [gender, setGender] = useState(""); // State for selected gender
  const [error, setError] = useState(true); // State for error message visibility

  const onNextPressed = () => {
    if (!gender) {
      // Show error message if gender is not selected
      setError(true);
      return;
    }

    // Navigate to the next screen (e.g., LoginScreen)
    navigation.navigate("TabNavDashboard", { gender });
  };

  const handleGenderSelection = (selectedGender) => {
    setGender(selectedGender);
    setError(false); // Hide error message when a gender is selected
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.header}>Select Your Gender</Text>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "male" && styles.genderButtonSelected,
          ]}
          onPress={() => handleGenderSelection("male")}
        >
          <Text
            style={[
              styles.genderButtonText,
              gender === "male" && styles.genderButtonTextSelected,
            ]}
          >
            ♂ Male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "female" && styles.genderButtonSelected,
          ]}
          onPress={() => handleGenderSelection("female")}
        >
          <Text
            style={[
              styles.genderButtonText,
              gender === "female" && styles.genderButtonTextSelected,
            ]}
          >
            ♀ Female
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "non-binary" && styles.genderButtonSelected,
          ]}
          onPress={() => handleGenderSelection("non-binary")}
        >
          <Text
            style={[
              styles.genderButtonText,
              gender === "non-binary" && styles.genderButtonTextSelected,
            ]}
          >
            ☿ Non-Binary
          </Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>Please select your gender.</Text>}
        <Button mode="contained" onPress={onNextPressed}>
          Submit
        </Button>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
  },
  genderButton: {
    width: 250,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray, // Default border color
    borderRadius: 5,
    marginBottom: 20,
  },
  genderButtonSelected: {
    borderColor: theme.colors.primary, // Highlighted border color when selected
  },
  genderButtonText: {
    fontSize: 16,
    color: theme.colors.gray, // Default text color
  },
  genderButtonTextSelected: {
    fontWeight: "bold",
    color: theme.colors.primary, // Highlighted text color when selected
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },
});
