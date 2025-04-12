
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { firebase } from '../../firebase/firebaseConfig';

// export default function ProfileScreen({ navigation }) {
//   const [userData, setUserData] = useState(null);
//   const user = firebase.auth().currentUser;

//   useEffect(() => {
//     const unsubscribe = firebase.firestore().collection('users').doc(user.uid).onSnapshot((doc) => {
//       if (doc.exists) {
//         setUserData(doc.data());
//       } else {
//         Alert.alert('User data not found');
//       }
//     }, (error) => {
//       console.error("Error fetching user data:", error);
//       Alert.alert('Error', 'Failed to load user data');
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, [user]);

//   const handleEditProfile = () => {
//     navigation.navigate('EditProfile');
//   };

//   if (!userData) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>User Profile</Text>
//       <View style={styles.profileCard}>
//         <Text style={styles.label}>Username:</Text>
//         <Text style={styles.value}>{userData.username}</Text>
//         <Text style={styles.label}>Email:</Text>
//         <Text style={styles.value}>{user?.email}</Text>
//         <Text style={styles.label}>User ID:</Text>
//         <Text style={styles.value}>{user?.uid}</Text>
//       </View>
//       <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
//         <Text style={styles.editButtonText}>Edit Profile</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#F3F6FB', // Light theme background for consistency
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F3F6FB',
//   },
//   heading: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#334155',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   profileCard: {
//     backgroundColor: '#FFFFFF', // White background for the profile card
//     borderRadius: 10,
//     padding: 20,
//     elevation: 3, // Shadow for some depth
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#555555', // Subtle color for labels
//     marginBottom: 5,
//   },
//   value: {
//     fontSize: 16,
//     color: '#1F2937', // Darker color for values
//     marginBottom: 15,
//   },
//   editButton: {
//     backgroundColor: '#5F7ADB', // Button color for consistency
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     elevation: 3,
//   },
//   editButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { firebase } from '../../firebase/firebaseConfig';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const user = firebase.auth().currentUser;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          Alert.alert('User data not found');
        }
      }, (error) => {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      });

    return () => unsubscribe(); // Cleanup listener
  }, [user]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Profile</Text>

      <Image
        source={
          userData.photoBase64
            ? { uri: `data:image/jpeg;base64,${userData.photoBase64}` }
            : require('../assets/img4.png')
        }
        style={styles.profileImage}
      />

      <View style={styles.profileCard}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{userData.username}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user?.uid}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F3F6FB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#5F7ADB',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
