// // src/screens/EditProfileScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { firebase } from '../../firebase/firebaseConfig';

// export default function EditProfileScreen({ navigation }) {
//   const user = firebase.auth().currentUser;
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         try {
//           const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
//           if (userDoc.exists) {
//             setUsername(userDoc.data().username);
//             setEmail(userDoc.data().email);
//           } else {
//             Alert.alert('User data not found');
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           Alert.alert('Error', 'Failed to load user data');
//         }
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   const handleSaveChanges = async () => {
//     try {
//       // Update Firestore user data
//       await firebase.firestore().collection('users').doc(user.uid).update({
//         username,
//         email
//       });

//       Alert.alert('Success', 'Profile updated successfully!');
//       navigation.goBack(); // Navigate back to ProfileScreen
//     } catch (error) {
//       console.error("Error updating user data:", error);
//       Alert.alert('Error', 'Failed to update profile');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Edit Profile</Text>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         style={styles.input}
//       />
//       <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
//         <Text style={styles.saveButtonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#F3F6FB',
//   },
//   heading: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#334155',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 10,
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   saveButton: {
//     backgroundColor: '#5F7ADB',
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   Image
// } from 'react-native';
// import { firebase } from '../../firebase/firebaseConfig';
// import { launchImageLibrary } from 'react-native-image-picker';

// export default function EditProfileScreen({ navigation }) {
//   const user = firebase.auth().currentUser;
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [photo, setPhoto] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         try {
//           const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
//           if (userDoc.exists) {
//             const data = userDoc.data();
//             setUsername(data.username);
//             setEmail(data.email);
//             setPhoto(data.photoURL || null);
//           } else {
//             Alert.alert('User data not found');
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           Alert.alert('Error', 'Failed to load user data');
//         }
//       }
//     };
//     fetchUserData();
//   }, [user]);

//   const pickImage = () => {
//     launchImageLibrary({ mediaType: 'photo' }, async (response) => {
//       if (!response.didCancel && response.assets?.length) {
//         const asset = response.assets[0];
//         const uri = asset.uri;
//         const responseBlob = await fetch(uri);
//         const blob = await responseBlob.blob();

//         const ref = firebase.storage().ref().child(`profile_photos/${user.uid}.jpg`);
//         await ref.put(blob);
//         const downloadURL = await ref.getDownloadURL();

//         setPhoto(downloadURL);
//       }
//     });
//   };

//   const handleSaveChanges = async () => {
//     try {
//       await firebase.firestore().collection('users').doc(user.uid).update({
//         username,
//         email,
//         photoURL: photo
//       });

//       Alert.alert('Success', 'Profile updated successfully!');
//       navigation.goBack();
//     } catch (error) {
//       console.error("Error updating user data:", error);
//       Alert.alert('Error', 'Failed to update profile');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Edit Profile</Text>

//       <TouchableOpacity onPress={pickImage}>
//         <Image
//           source={
//             photo
//               ? { uri: photo }
//               : require('../assets/img4.png') // Make sure you have a default icon here
//           }
//           style={styles.profileImage}
//         />
//         <Text style={styles.changePhotoText}>Change Photo</Text>
//       </TouchableOpacity>

//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         style={styles.input}
//       />
//       <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
//         <Text style={styles.saveButtonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#F3F6FB',
//   },
//   heading: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#334155',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     alignSelf: 'center',
//     marginBottom: 10,
//   },
//   changePhotoText: {
//     textAlign: 'center',
//     color: '#5F7ADB',
//     fontWeight: '600',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 10,
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   saveButton: {
//     backgroundColor: '#5F7ADB',
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import { firebase } from '../../firebase/firebaseConfig';
// import { launchImageLibrary } from 'react-native-image-picker';

// export default function EditProfileScreen({ navigation }) {
//   const user = firebase.auth().currentUser;
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch user data from Firestore
//   const fetchUserData = async () => {
//     if (user) {
//       try {
//         const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
//         if (userDoc.exists) {
//           const data = userDoc.data();
//           setUsername(data.username || '');
//           setEmail(data.email || user.email);
//           setPhoto(data.photoURL || null);
//         } else {
//           Alert.alert('User data not found');
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         Alert.alert('Error', 'Failed to load user data');
//       }
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   // Pick and upload profile photo
//   const pickImage = () => {
//     launchImageLibrary(
//       { mediaType: 'photo', includeBase64: true },
//       async (response) => {
//         if (!response.didCancel && response.assets?.length) {
//           try {
//             setLoading(true);
//             const asset = response.assets[0];
//             const base64Image = asset.base64;

//             const ref = firebase.storage().ref().child(`profile_photos/${user.uid}.jpg`);
//             await ref.putString(base64Image, 'base64');
//             const downloadURL = await ref.getDownloadURL();

//             setPhoto(downloadURL);
//             setLoading(false);
//             Alert.alert('Success', 'Photo uploaded successfully!');
//           } catch (error) {
//             console.error('Image upload failed:', error);
//             setLoading(false);
//             Alert.alert('Error', 'Failed to upload image');
//           }
//         }
//       }
//     );
//   };

//   // Save updated username, email, photoURL
//   const handleSaveChanges = async () => {
//     try {
//       setLoading(true);
//       await firebase.firestore().collection('users').doc(user.uid).update({
//         username,
//         email,
//         photoURL: photo || null
//       });

//       Alert.alert('Success', 'Profile updated successfully!');
//       setLoading(false);
//       navigation.goBack(); // Return to previous screen
//     } catch (error) {
//       console.error("Error updating user data:", error);
//       setLoading(false);
//       Alert.alert('Error', 'Failed to update profile');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Edit Profile</Text>

//       <TouchableOpacity onPress={pickImage}>
//         <Image
//           source={
//             photo
//               ? { uri: photo }
//               : require('../assets/img4.png') // Make sure this file exists
//           }
//           style={styles.profileImage}
//         />
//         <Text style={styles.changePhotoText}>Change Photo</Text>
//       </TouchableOpacity>

//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         style={styles.input}
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#5F7ADB" />
//       ) : (
//         <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
//           <Text style={styles.saveButtonText}>Save Changes</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#F3F6FB',
//   },
//   heading: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#334155',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     alignSelf: 'center',
//     marginBottom: 10,
//   },
//   changePhotoText: {
//     textAlign: 'center',
//     color: '#5F7ADB',
//     fontWeight: '600',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 10,
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   saveButton: {
//     backgroundColor: '#5F7ADB',
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { firebase } from '../../firebase/firebaseConfig';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfileScreen({ navigation }) {
  const user = firebase.auth().currentUser;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [photoBase64, setPhotoBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    console.log('Fetching user data...');
    if (user) {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setUsername(data.username || '');
          setEmail(data.email || user.email);
          setPhotoBase64(data.photoBase64 || null);
          console.log('User data loaded:', data);
        } else {
          console.log('User document not found');
          Alert.alert('Error', 'User data not found');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert('Error', 'Failed to load user data');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const pickImage = () => {
    console.log('Opening image picker...');
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true, quality: 0.5 },
      (response) => {
        if (response.didCancel) {
          console.log('Image selection canceled');
        } else if (response.errorCode) {
          console.error('Image picker error:', response.errorMessage);
          Alert.alert('Error', 'Image picker error');
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          console.log('Image selected, updating state...');
          setPhotoBase64(asset.base64); // Save base64 string
          Alert.alert('Image selected');
        }
      }
    );
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      console.log('Saving profile changes...');
      await firebase.firestore().collection('users').doc(user.uid).update({
        username,
        email,
        photoBase64: photoBase64 || null,
      });
      console.log('Profile updated');
      Alert.alert('Success', 'Profile updated successfully!');
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user data:", error);
      setLoading(false);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            photoBase64
              ? { uri: `data:image/jpeg;base64,${photoBase64}` }
              : require('../assets/img4.png')
          }
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#5F7ADB" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F3F6FB',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  changePhotoText: {
    textAlign: 'center',
    color: '#5F7ADB',
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#5F7ADB',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
