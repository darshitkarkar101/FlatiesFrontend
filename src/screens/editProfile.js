import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Jane Doe');
  const [gender, setGender] = useState('Female');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Retrieve email from AsyncStorage
    AsyncStorage.getItem('login')
      .then((data) => {
        console.log('Data retrieved from AsyncStorage:', data);
        const parsedData = JSON.parse(data);
        setName (parsedData.payload.admin.name); // Accessing name from the correct path
        setEmail(parsedData.payload.admin.email); // Accessing email from the correct path
        console.log('Email retrieved from AsyncStorage:', parsedData.payload.admin.email);
      })
      .catch((error) => {
        console.error('Error retrieving data from AsyncStorage:', error);
      });
  }, []);

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Clear AsyncStorage and navigate to login screen
    AsyncStorage.clear()
      .then(() => {
        console.log('AsyncStorage cleared successfully');
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      })
      .catch((error) => {
        console.error('Error clearing AsyncStorage:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://www.bootdey.com/image/900x400/00296B/000000' }}
        style={styles.coverImage}
      />
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://www.bootdey.com/img/Content/avatar/avatar2.png' }}
          style={styles.avatar}
        />
        {!isEditing && (
          <Text style={[styles.name, styles.textWithShadow]}>{name}</Text>
        )}
      </View>
      <View style={styles.content}>
        {!isEditing && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        )}
        {isEditing && (
          <View style={styles.infoContainer2}>
            <Text style={styles.infoLabel2}>Name:</Text>
            <TextInput
              style={[styles.editableText2]}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Gender:</Text>
          {isEditing ? (
            <View style={styles.genderSelection}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Male' && styles.genderButtonSelected]}
                onPress={() => setGender('Male')}
              >
                <Text style={styles.genderButtonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Female' && styles.genderButtonSelected]}
                onPress={() => setGender('Female')}
              >
                <Text style={styles.genderButtonText}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Other' && styles.genderButtonSelected]}
                onPress={() => setGender('Other')}
              >
                <Text style={styles.genderButtonText}>Other</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.infoValue}>{gender}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSubmit : handleEditPress}>
        <Icon name={isEditing ? "checkmark" : "pencil"} size={20} color="#fff" />
        <Text style={styles.editButtonText}>{isEditing ? 'Submit' : 'Edit'}</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  coverImage: {
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderBlockColor: 'white',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white',
  },
  textWithShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  editableText: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  content: {
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoContainer2: {
    marginTop: 40,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoLabel2: {
    fontWeight: 'bold',
  },
  infoValue: {
    marginTop: 5,
  },
  editableText2: {
    backgroundColor: 'white',
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  genderSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
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
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#fbbf24',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#00296B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
