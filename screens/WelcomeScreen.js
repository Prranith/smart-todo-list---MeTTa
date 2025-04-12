// // screens/WelcomeScreen.js

// import React, { useRef } from 'react';
// import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
// import Video from 'react-native-video';

// export default function WelcomeScreen({ navigation }) {
//   const videoRef = useRef(null);

//   const handleVideoEnd = () => {
//     navigation.replace('Signup'); // Navigate after video ends
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       <Video
//         source={require('../assets/intro.mp4')}
//         onEnd={handleVideoEnd}
//         resizeMode="cover"
//         style={styles.backgroundVideo}
//         muted={false}
//         repeat={false}
//         fullscreen
//       />
//     </View>
//   );
// }

// const { width, height } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   backgroundVideo: {
//     width: width,
//     height: height,
//   },
// });
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const [showButton, setShowButton] = useState(false);
  const navigation = useNavigation();
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    // Show the button after 3 seconds
    setTimeout(() => setShowButton(true), 10);
  };

  const handleStart = () => {
    navigation.replace('Signup'); // Replace Welcome with Signup screen
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/intro1.mp4')} // place your video here
        ref={videoRef}
        style={styles.backgroundVideo}
        resizeMode="cover"
        onEnd={handleVideoEnd}
        muted={false}
        repeat={false}
      />

      {showButton && (
        <Animatable.View animation="fadeInUp"  style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    width: width,
    height: height,
    position: 'absolute',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6a0dad',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
