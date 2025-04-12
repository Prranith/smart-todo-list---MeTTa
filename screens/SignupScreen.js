
// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   useColorScheme,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { firebase } from '../../firebase/firebaseConfig';

// export default function SignupScreen({ navigation }) {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const theme = useColorScheme(); // light or dark

//   const handleSignup = async () => {
//     if (!username || !email || !password) {
//       Alert.alert('Missing Fields', 'All fields are required.');
//       return;
//     }

//     try {
//       const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
//       const uid = userCredential.user.uid;

//       await firebase.firestore().collection('users').doc(uid).set({
//         username,
//         email,
//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       });

//       Alert.alert('Success', 'Welcome to MindTasks!');
//       navigation.navigate('Dashboard');
//     } catch (error) {
//       Alert.alert('Signup Failed', error.message);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={[styles.container, theme === 'dark' ? styles.darkTheme : styles.lightTheme]}
//     >
//       <Text style={styles.title}>Welcome to MindTasks</Text>
//       <Text style={styles.subtitle}>Let’s create your account</Text>

//       <TextInput
//         placeholder="Username"
//         placeholderTextColor="#A0A0A0"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Email"
//         placeholderTextColor="#A0A0A0"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Password"
//         placeholderTextColor="#A0A0A0"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSignup}>
//         <Text style={styles.buttonText}>Create Account</Text>
//       </TouchableOpacity>

//       <Text style={styles.footerText}>
//         Already have an account?{' '}
//         <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
//           Sign In
//         </Text>
//       </Text>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: '#F3F6FB', // Default light theme background
//   },
//   darkTheme: {
//     backgroundColor: '#0F1117', // Dark mode background
//   },
//   lightTheme: {
//     backgroundColor: '#F3F6FB', // Light mode background
//   },
//   title: {
//     fontSize: 32, // Increased title font size for better emphasis
//     fontWeight: 'bold',
//     color: '#334155', // Softer color for readability
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 18, // Increased subtitle font size
//     color: '#64748B', // Soft gray for subtitle text
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   input: {
//     backgroundColor: '#FFFFFF', // White background for inputs
//     borderWidth: 1,
//     borderColor: '#D1D5DB', // Light gray border color
//     borderRadius: 10, // Simplified rounded corners for a cleaner look
//     paddingVertical: 16,
//     paddingHorizontal: 18,
//     fontSize: 16,
//     marginBottom: 12,
//     color: '#1F2937', // Darker color for text input
//   },
//   button: {
//     backgroundColor: '#5F7ADB', // Button color
//     paddingVertical: 16,
//     borderRadius: 10, // More subtle rounding for buttons
//     elevation: 5, // Shadow effect for the button to elevate it
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFFFFF', // White text for the button
//     fontWeight: 'bold',
//     fontSize: 18, // Larger font size for improved tapability
//   },
//   footerText: {
//     marginTop: 20,
//     fontSize: 14,
//     color: '#6B7280', // Medium gray for footer text
//     textAlign: 'center',
//   },
//   link: {
//     color: '#5F7ADB', // Link color for visibility
//     fontWeight: 'bold', // Bold link for emphasis
//   },
// });
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { firebase } from '../../firebase/firebaseConfig';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useColorScheme();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'All fields are required.');
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      await firebase.firestore().collection('users').doc(uid).set({
        username,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Welcome to MindTasks!');
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img3.jpg')} // ensure this path is correct
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Text style={styles.title}>Welcome to MindTasks</Text>
        <Text style={styles.subtitle}>Let’s create your account</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#CCCCCC"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#CCCCCC"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSignup} style={styles.button} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Sign In
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'rgba(22, 21, 21, 0.31)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#A1A1AA',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.2,
    borderColor: '#555',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 14,
    color: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#3B3B3D',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#5B5B60',
    marginTop: 10,
  },
  buttonText: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  footerText: {
    marginTop: 24,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  link: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
