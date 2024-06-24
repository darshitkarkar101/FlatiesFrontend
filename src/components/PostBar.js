import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window'); // Get the device's width

const PostBar = ({ onCloseModal, onHousePost, onRoommatePost }) => {
  const handleClose = () => {
    onCloseModal(); // Close the PostBar
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Icon name="close" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Create Post</Text>
      <TouchableOpacity style={styles.button} onPress={onHousePost}>
        <Text style={styles.buttonText}>Post a House</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onRoommatePost}>
        <Text style={styles.buttonText}>Find Roommates</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: width - 20, // Set width based on device width minus some padding
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#fbbf24',
    width: '100%', // Button takes full width of its container
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default PostBar;
