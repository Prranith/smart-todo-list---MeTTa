// // import React, { useState } from 'react';
// // import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// // import { sendPasswordResetEmail } from 'firebase/auth';
// // import { auth } from '../../firebase/firebaseConfig';

// // export default function ForgotPasswordScreen({ navigation }) {
// //   const [email, setEmail] = useState('');

// //   const handleReset = async () => {
// //     try {
// //       await sendPasswordResetEmail(auth, email);
// //       Alert.alert('Reset link sent to your email!');
// //       navigation.navigate('Login');
// //     } catch (error) {
// //       Alert.alert('Error', error.message);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Reset Password</Text>
// //       <TextInput style={styles.input} placeholder="Enter your email" onChangeText={setEmail} value={email} />
// //       <Button title="Send Reset Email" onPress={handleReset} />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { padding: 20, marginTop: 100 },
// //   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
// //   input: { borderWidth: 1, padding: 10, marginVertical: 10 },
// // });
// // import React, { useState } from 'react';
// // import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// // import { sendPasswordResetEmail } from 'firebase/auth';
// // import { auth } from '../../firebase/firebaseConfig';

// // export default function ForgotPasswordScreen({ navigation }) {
// //   const [email, setEmail] = useState('');

// //   const handleReset = async () => {
// //     try {
// //       await sendPasswordResetEmail(auth, email);
// //       Alert.alert('✅ Reset Link Sent', 'Check your email to reset your password.');
// //       navigation.navigate('Login');
// //     } catch (error) {
// //       Alert.alert('Error ❌', error.message);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.logo}>🧠 Mindlancer</Text>
// //       <Text style={styles.subtitle}>Forgot your password? Let’s fix that.</Text>

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Enter your email"
// //         placeholderTextColor="#aaa"
// //         onChangeText={setEmail}
// //         value={email}
// //         keyboardType="email-address"
// //         autoCapitalize="none"
// //       />

// //       <TouchableOpacity style={styles.button} onPress={handleReset}>
// //         <Text style={styles.buttonText}>Send Reset Email</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// //         <Text style={styles.link}>
// //           Remember your password? <Text style={{ color: '#6200ee' }}>Login</Text>
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     paddingHorizontal: 24,
// //     paddingTop: 100,
// //     flex: 1,
// //     backgroundColor: '#fff',
// //   },
// //   logo: {
// //     marginTop:90,
// //     fontSize: 36,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 8,
// //     color: '#6200ee',
// //   },
// //   subtitle: {
// //     fontSize: 18,
// //     textAlign: 'center',
// //     marginBottom: 32,
// //     color: '#666',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     padding: 14,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //     fontSize: 16,
// //     backgroundColor: '#f9f9f9',
// //   },
// //   button: {
// //     backgroundColor: '#6200ee',
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //     alignItems: 'center',
// //     elevation: 2,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   link: {
// //     textAlign: 'center',
// //     fontSize: 14,
// //     color: '#666',
// //     marginTop: 8,
// //   },
// // });


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   useColorScheme,
// } from 'react-native';
// import { sendPasswordResetEmail } from 'firebase/auth';
// import { auth } from '../../firebase/firebaseConfig';

// export default function ForgotPasswordScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';

//   const handleReset = async () => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//       Alert.alert('✅ Reset Link Sent', 'Check your email to reset your password.');
//       navigation.navigate('Login');
//     } catch (error) {
//       Alert.alert('Error ❌', error.message);
//     }
//   };

//   return (
//     <View
//       style={[
//         styles.container,
//         { backgroundColor: isDarkMode ? '#121212' : '#ffffff' },
//       ]}
//     >
//       <Text
//         style={[
//           styles.logo,
//           { color: isDarkMode ? '#BB86FC' : '#6200ee' },
//         ]}
//       >
//         🧠 Mindlancer
//       </Text>

//       <Text
//         style={[
//           styles.subtitle,
//           { color: isDarkMode ? '#ccc' : '#666' },
//         ]}
//       >
//         Forgot your password? Let’s fix that.
//       </Text>

//       <TextInput
//         style={[
//           styles.input,
//           {
//             backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9',
//             color: isDarkMode ? '#fff' : '#000',
//             borderColor: isDarkMode ? '#444' : '#ddd',
//           },
//         ]}
//         placeholder="Enter your email"
//         placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
//         onChangeText={setEmail}
//         value={email}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TouchableOpacity style={styles.button} onPress={handleReset}>
//         <Text style={styles.buttonText}>Send Reset Email</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text
//           style={[
//             styles.link,
//             { color: isDarkMode ? '#ccc' : '#666' },
//           ]}
//         >
//           Remember your password?{' '}
//           <Text style={{ color: '#6200ee' }}>Login</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 24,
//     paddingTop: 100,
//     flex: 1,
//   },
//   logo: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   input: {
//     borderWidth: 1,
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#6200ee',
//     paddingVertical: 14,
//     borderRadius: 10,
//     marginBottom: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   link: {
//     textAlign: 'center',
//     fontSize: 14,
//     marginTop: 8,
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { firebase } from '../../firebase/firebaseConfig';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert('✅ Reset Link Sent', 'Check your email to reset your password.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error ❌', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/img3.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email to get the reset link.
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity onPress={handleReset} activeOpacity={0.9}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Send Reset Email</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Back to{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login
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
    marginTop: 8,
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
