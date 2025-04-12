
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

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const theme = useColorScheme(); // Get current theme

//   const handleLogin = async () => {
//     try {
//       await firebase.auth().signInWithEmailAndPassword(email, password);
//       navigation.navigate('Dashboard');
//     } catch (error) {
//       console.error('Login Error:', error);
//       Alert.alert('Login Failed', error.message);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={[styles.container, theme == 'dark' ? styles.darkTheme : styles.lightTheme]}
//     >
//       <Text style={styles.heading}>Login</Text>

//       <TextInput
//         placeholder="Email"
//         placeholderTextColor="#A0A0A0"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Password"
//         placeholderTextColor="#A0A0A0"
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>

//       <Text style={styles.footerText}>
//         Don't have an account?{' '}
//         <Text styles={styles.link} onPress={() => navigation.navigate('Signup')}>
//           Signup
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
//   heading: {
//     fontSize: 32, // Increased title font size for better emphasis
//     fontWeight: 'bold',
//     color: '#334155', // Softer color for readability
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#FFFFFF', // White background for inputs
//     borderWidth: 1,
//     borderColor: '#D1D5DB', // Light gray border color
//     borderRadius: 10, // Rounded corners for a clean look
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     fontSize: 16,
//     marginBottom: 15,
//     color: '#1F2937', // Darker text color for visibility
//   },
//   button: {
//     backgroundColor: '#5F7ADB', // Button color
//     paddingVertical: 16,
//     borderRadius: 10, // Softly rounded button
//     elevation: 5, // Shadow effect for elevation
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFFFFF', // White text for the button
//     fontWeight: 'bold',
//     fontSize: 18, // Increased font size for better legibility
//   },
//   footerText: {
//     marginTop: 20,
//     fontSize: 14,
//     color: '#6B7280', // Neutral color for footer text
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
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { firebase } from '../../firebase/firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img3.jpg')} // Make sure this image is present
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Let’s log you in</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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

        <TouchableOpacity onPress={handleLogin} activeOpacity={0.9}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
            Sign Up
          </Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

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
    backgroundColor: 'rgba(22, 21, 21, 0.31)', // same as signup
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
  forgotText: {
    color: '#A1A1AA',
    textAlign: 'right',
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: 'grey',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#5B5B60',
  },
  buttonText: {
    color: 'white',
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
