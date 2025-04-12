import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert,
  ActivityIndicator, TouchableOpacity, Animated
} from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { firebase } from '../../firebase/firebaseConfig';
import axios from 'axios';

// Configurable API endpoint (update for production or use environment variable)
const API_ENDPOINT = 'https://eeda-2401-4900-92cd-b19b-404-5d59-55e8-8285.ngrok-free.app/parse-task'; // Local development URL

const VoiceInputScreen = ({ navigation }) => {
  const [voiceInput, setVoiceInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const user = firebase.auth().currentUser;

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartial;

    // Optional TTS settings
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);

    startPassiveListening(); // Start wake word detection

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.stop();
    };
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.setValue(1);
  };

  const onSpeechResults = (e) => {
    const transcript = e.value[0];
    // Sanitize input to remove wake words and noise
    const sanitizedInput = transcript
      .replace(/hey chitti|hd/gi, '')
      .replace(/\bare\b|\bevening\b/gi, '')
      .trim()
      .replace(/\s+/g, ' '); // Normalize spaces
    setVoiceInput(sanitizedInput);
    if (sanitizedInput) {
      handleParseAndSaveTask(sanitizedInput);
    } else {
      Alert.alert('Error', 'No valid task detected in voice input.');
    }
  };

  const onSpeechPartial = async (e) => {
    if (e.value) {
      const match = e.value.some(text =>
        text.toLowerCase().includes('hey chitti')
      );
      if (match) {
        stopPassiveListening();

        // Speak response before recording
        Tts.speak('Hello, add your voice task');
        Tts.addEventListener('tts-finish', async () => {
          startRecording();
        });
      }
    }
  };

  const onSpeechEnd = () => {
    setIsRecording(false);
    stopPulse();
  };

  const onSpeechError = (error) => {
    console.error('Speech error:', error);
    Alert.alert('Voice Error', 'Could not process voice input.');
    setIsRecording(false);
    stopPulse();
  };

  const startRecording = async () => {
    try {
      setVoiceInput('');
      setIsRecording(true);
      startPulse();
      await Voice.start('en-US');
    } catch (error) {
      console.error('Start recording error:', error);
      Alert.alert('Error', 'Failed to start voice recognition');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const startPassiveListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Passive listening error:', error);
    }
  };

  const stopPassiveListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Stop passive listening error:', error);
    }
  };

  const handleParseAndSaveTask = async (input) => {
    if (!input || !input.trim()) {
      Alert.alert('Error', 'Please speak a task description');
      return;
    }

    if (!user) {
      Alert.alert('Auth Error', 'User not logged in');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINT, {
        voice_input: input
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10-second timeout
      });

      const parsedTask = response.data;

      if (parsedTask.error) {
        throw new Error(parsedTask.error || 'Failed to parse task');
      }

      // Simplified date parsing for ISO 8601 format
      const parseDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') {
          console.warn('Invalid date string input:', dateStr, 'falling back to current date');
          return new Date();
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date after parsing:', dateStr, 'falling back to current date');
          return new Date();
        }
        console.log('Parsed date successfully:', date.toString());
        return date;
      };

      // Preprocess API strings to Firestore Timestamps
      const startDate = parseDate(parsedTask.startTime);
      const endDate = parseDate(parsedTask.endTime);

      // Validate parsed dates
      if (isNaN(startDate.getTime())) {
        console.warn('Invalid startTime, using current date:', parsedTask.startTime);
      }
      if (isNaN(endDate.getTime())) {
        console.warn('Invalid endTime, using current date:', parsedTask.endTime);
      }

      // Prepare task with Timestamp objects to match AddTaskScreen
      const taskToSave = {
        title: typeof parsedTask.title === 'string' ? parsedTask.title : 'Untitled Task',
        description: typeof parsedTask.description === 'string' ? parsedTask.description : '',
        category: typeof parsedTask.category === 'string' ? parsedTask.category : 'General',
        priority: typeof parsedTask.priority === 'string' ? parsedTask.priority : 'Medium',
        duration: typeof parsedTask.duration === 'number' ? parsedTask.duration : 60,
        completed: typeof parsedTask.completed === 'boolean' ? parsedTask.completed : false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        startTime: firebase.firestore.Timestamp.fromDate(startDate),
        endTime: firebase.firestore.Timestamp.fromDate(endDate)
      };

      // Log for debugging
      console.log('Parsed startTime Date:', startDate);
      console.log('Parsed endTime Date:', endDate);
      console.log('Task to save:', taskToSave);

      const taskRef = firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('tasks');

      await taskRef.add(taskToSave);

      Alert.alert('✅ Task Added', 'Your task has been saved!');
      setVoiceInput('');
      navigation.goBack();

    } catch (error) {
      console.error('Task creation error:', error);
      Alert.alert('Error', error.message || 'Failed to save task. Please check your input or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Chitti Smart Assistant</Text>
      <Text style={styles.subTitle}>Say “Hey Chitti” to start</Text>

      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.micWrapper}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.pulse, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.micButton}>
          <Text style={styles.micText}>{isRecording ? '🛑' : '🎤'}</Text>
        </View>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Saving your task...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf4ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center'
  },
  micWrapper: {
    marginBottom: 30
  },
  pulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007BFF',
    opacity: 0.3,
    zIndex: -1
  },
  micButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  micText: {
    fontSize: 38,
    color: '#fff'
  },
  loadingWrapper: {
    alignItems: 'center',
    marginTop: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555'
  }
});

export default VoiceInputScreen;