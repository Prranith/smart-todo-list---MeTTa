import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, useColorScheme
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { firebase } from '../../firebase/firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

const priorities = ['High', 'Medium', 'Low'];

export default function AddTaskScreen({ navigation }) {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 3600000));
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [pickerType, setPickerType] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const calculateDuration = () => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.max(Math.round(diffMs / 60000), 0);
    return diffMins;
  };

  const showDatePicker = (type) => {
    setPickerType(type);
    setPickerVisible(true);
  };

  const hideDatePicker = () => setPickerVisible(false);

  const handleConfirm = (selectedDate) => {
    if (pickerType === 'start') setStartDate(selectedDate);
    else setEndDate(selectedDate);
    hideDatePicker();
  };

  const formatDateTime = (date) => moment(date).format('ddd, MMM D, YYYY • hh:mm A');

  const handleAddTask = async () => {
    if (!task.trim()) {
      Alert.alert('Task title is required!');
      return;
    }

    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error('User not authenticated');

      const taskData = {
        title: task,
        description,
        startTime: firebase.firestore.Timestamp.fromDate(startDate),
        endTime: firebase.firestore.Timestamp.fromDate(endDate),
        duration: calculateDuration(),
        priority,
        category,
        completed: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('tasks')
        .add(taskData);

      Alert.alert('✅ Task added!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Error adding task', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#F9FAFB' }]}>
      <Text style={[styles.heading, { color: isDark ? '#f1f5f9' : '#1E3A8A' }]}>📌 Add New Task</Text>

      <TextInput
        placeholder="Task Title *"
        placeholderTextColor={isDark ? '#cbd5e1' : '#64748b'}
        style={[styles.input, { backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000' }]}
        value={task}
        onChangeText={setTask}
      />

      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor={isDark ? '#cbd5e1' : '#64748b'}
        style={[styles.input, { height: 80, backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000' }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity onPress={() => showDatePicker('start')} style={styles.dateButton}>
        <Text style={styles.dateText}>📆 Start: {formatDateTime(startDate)}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => showDatePicker('end')} style={styles.dateButton}>
        <Text style={styles.dateText}>🕒 End: {formatDateTime(endDate)}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        date={pickerType === 'start' ? startDate : endDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Text style={{ marginBottom: 10, fontWeight: '500', color: isDark ? '#f1f5f9' : '#1e293b' }}>
        ⏳ Task Duration: {calculateDuration()} mins
      </Text>

      <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#334155' }]}>Priority</Text>
      <View style={styles.checkboxGroup}>
        {priorities.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.checkbox,
              {
                backgroundColor: priority === p ? '#2563EB' : isDark ? '#1e293b' : '#e2e8f0',
              },
            ]}
            onPress={() => setPriority(p)}
          >
            <Ionicons
              name={priority === p ? 'checkbox' : 'square-outline'}
              size={20}
              color={priority === p ? '#fff' : isDark ? '#cbd5e1' : '#1e293b'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.checkboxText, { color: priority === p ? '#fff' : isDark ? '#cbd5e1' : '#1e293b' }]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Category (e.g. Work, Health)"
        placeholderTextColor={isDark ? '#cbd5e1' : '#64748b'}
        style={[styles.input, { backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000' }]}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>➕ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  input: {
    borderRadius: 10, padding: 14, fontSize: 16,
    marginBottom: 15, borderWidth: 1, borderColor: '#94A3B8',
  },
  dateButton: {
    backgroundColor: '#E0F2FE', padding: 12,
    borderRadius: 10, marginBottom: 15
  },
  dateText: { fontSize: 15, color: '#0369A1', fontWeight: '500' },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 8, flex: 1, marginRight: 10
  },
  checkboxText: { fontSize: 15, fontWeight: '500' },
  button: {
    backgroundColor: '#2563EB', padding: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 10
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
