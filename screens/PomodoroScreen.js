import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';

export default function PomodoroScreen() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0) {
      Vibration.vibrate();
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const resetTimer = () => {
    setSecondsLeft(25 * 60);
    setIsRunning(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏱️ Pomodoro Timer</Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setIsRunning(!isRunning)}>
          <Text style={styles.controlText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: '#EF4444' }]} onPress={resetTimer}>
          <Text style={styles.controlText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#1E3A8A', marginBottom: 30 },
  timer: { fontSize: 64, fontWeight: 'bold', color: '#3B82F6', marginBottom: 40 },
  buttonRow: { flexDirection: 'row' },
  controlBtn: {
    backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 10, marginHorizontal: 10
  },
  controlText: { fontSize: 18, color: '#fff', fontWeight: '600' }
});
