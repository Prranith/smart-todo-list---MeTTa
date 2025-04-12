// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, FlatList, TouchableOpacity,
//   StyleSheet, Alert, useColorScheme
// } from 'react-native';
// import { firebase } from '../../firebase/firebaseConfig';
// import Icon from 'react-native-vector-icons/Ionicons';

// export default function TasksScreen() {
//   const [tasks, setTasks] = useState([]);
//   const theme = useColorScheme();
//   const isDark = theme === 'dark';

//   useEffect(() => {
//     const user = firebase.auth().currentUser;
//     if (!user) {
//       console.warn('No authenticated user found');
//       return;
//     }

//     const unsubscribe = firebase.firestore()
//       .collection('users')
//       .doc(user.uid)
//       .collection('tasks')
//       .orderBy('createdAt', 'desc')
//       .onSnapshot(
//         snapshot => {
//           const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//           // Log tasks to debug
//           console.log('Fetched tasks:', data);
//           setTasks(data);
//         },
//         error => {
//           console.error('Error fetching tasks:', error);
//           Alert.alert('Error', 'Failed to load tasks');
//         }
//       );

//     return unsubscribe;
//   }, []);

//   const toggleComplete = async (taskId, currentStatus) => {
//     try {
//       const user = firebase.auth().currentUser;
//       await firebase.firestore()
//         .collection('users')
//         .doc(user.uid)
//         .collection('tasks')
//         .doc(taskId)
//         .update({ completed: !currentStatus });
//     } catch (error) {
//       Alert.alert('Update Failed', error.message);
//     }
//   };

//   const deleteTask = async (taskId) => {
//     Alert.alert(
//       'Delete Task',
//       'Are you sure you want to delete this task?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const user = firebase.auth().currentUser;
//               await firebase.firestore()
//                 .collection('users')
//                 .doc(user.uid)
//                 .collection('tasks')
//                 .doc(taskId)
//                 .delete();
//               Alert.alert('Task deleted');
//             } catch (error) {
//               Alert.alert('Delete Failed', error.message);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.taskItem,
//         item.completed && styles.completedTask,
//         { backgroundColor: isDark ? (item.completed ? '#1f2e1f' : '#1e293b') : (item.completed ? '#e0fce4' : '#ffffff') }
//       ]}
//       onPress={() => toggleComplete(item.id, item.completed)}
//       onLongPress={() => deleteTask(item.id)}
//       activeOpacity={0.85}
//     >
//       <Icon
//         name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
//         size={26}
//         color={item.completed ? '#22C55E' : '#3B82F6'}
//         style={{ marginTop: 5 }}
//       />
//       <View style={styles.taskContent}>
//         <Text style={[styles.taskTitle, item.completed && styles.lineThrough, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
//           {item.title || 'Untitled Task'}
//         </Text>
//         {item.description ? (
//           <Text style={[styles.taskDesc, { color: isDark ? '#94a3b8' : '#475569' }]}>
//             {item.description}
//           </Text>
//         ) : null}
//         <View style={styles.metaRow}>
//           <Icon name="layers-outline" size={16} color="#64748B" />
//           <Text style={styles.metaText}>{item.category || 'General'}</Text>
//         </View>
//         <View style={styles.metaRow}>
//           <Icon name="flag-outline" size={16} color="#64748B" />
//           <Text style={styles.metaText}>Priority: {item.priority || 'Not Set'}</Text>
//         </View>
//         <View style={styles.metaRow}>
//           <Icon name="time-outline" size={16} color="#64748B" />
//           <Text style={styles.metaText}>Duration: {item.duration || 'Not Set'} mins</Text>
//         </View>
//         <View style={styles.metaRow}>
//           <Icon name="calendar-outline" size={16} color="#64748B" />
//           <Text style={styles.metaText}>
//             Starts: {
//               item.startTime && typeof item.startTime.toDate === 'function'
//                 ? item.startTime.toDate().toLocaleString()
//                 : 'Not Set'
//             }
//           </Text>
//         </View>
//         <View style={styles.metaRow}>
//           <Icon name="calendar-outline" size={16} color="#64748B" />
//           <Text style={styles.metaText}>
//             Ends: {
//               item.endTime && typeof item.endTime.toDate === 'function'
//                 ? item.endTime.toDate().toLocaleString()
//                 : 'Not Set'
//             }
//           </Text>
//         </View>
//         <View style={styles.statusRow}>
//           <Text style={[styles.statusText, { color: item.completed ? '#22C55E' : '#EF4444' }]}>
//             {item.completed ? 'Completed' : 'Not Completed'}
//           </Text>
//           <TouchableOpacity onPress={() => deleteTask(item.id)}>
//             <Icon name="trash-outline" size={20} color="#EF4444" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter(t => t.completed).length;
//   const pendingTasks = totalTasks - completedTasks;

//   return (
//     <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#F9FAFB' }]}>
//       <Text style={[styles.heading, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>
//         My Tasks
//       </Text>

//       {/* Task Summary */}
//       <View style={[
//         styles.summaryBox,
//         { backgroundColor: isDark ? '#1e293b' : '#E0F2FE' }
//       ]}>
//         <View style={styles.summaryItem}>
//           <Icon name="list-outline" size={20} color="#0EA5E9" />
//           <Text style={styles.summaryText}>Total: {totalTasks}</Text>
//         </View>
//         <View style={styles.summaryItem}>
//           <Icon name="checkmark-done-outline" size={20} color="#22C55E" />
//           <Text style={styles.summaryText}>Done: {completedTasks}</Text>
//         </View>
//         <View style={styles.summaryItem}>
//           <Icon name="time-outline" size={20} color="#F59E0B" />
//           <Text style={styles.summaryText}>Pending: {pendingTasks}</Text>
//         </View>
//       </View>

//       <FlatList
//         data={tasks}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 30 }}
//         ListEmptyComponent={<Text style={{ color: isDark ? '#94a3b8' : '#475569', textAlign: 'center', marginTop: 20 }}>No tasks available</Text>}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   heading: { fontSize: 24, fontWeight: '700', marginBottom: 15 },
//   summaryBox: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 20
//   },
//   summaryItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6
//   },
//   summaryText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0f172a'
//   },
//   taskItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#cbd5e1'
//   },
//   completedTask: {
//     borderColor: '#22C55E'
//   },
//   taskContent: { marginLeft: 12, flex: 1 },
//   taskTitle: { fontSize: 16, fontWeight: '700' },
//   lineThrough: { textDecorationLine: 'line-through' },
//   taskDesc: { fontSize: 13, marginTop: 2 },
//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//     gap: 6
//   },
//   metaText: { fontSize: 12, color: '#475569' },
//   statusRow: {
//     marginTop: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   statusText: { fontSize: 13, fontWeight: '600' }
// });
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, useColorScheme
} from 'react-native';
import { firebase } from '../../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.warn('No authenticated user found');
      return;
    }

    const unsubscribe = firebase.firestore()
      .collection('users')
      .doc(user.uid)
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const data = snapshot.docs.map(doc => {
            const taskData = { id: doc.id, ...doc.data() };
            // Convert Firestore Timestamp objects or parse strings to Date objects
            ['createdAt', 'startTime', 'endTime'].forEach(field => {
              if (taskData[field]) {
                if (typeof taskData[field].toDate === 'function') {
                  taskData[field] = taskData[field].toDate();
                } else if (typeof taskData[field] === 'string') {
                  taskData[field] = parseCustomDate(taskData[field]);
                } else {
                  taskData[field] = null; // Handle unexpected types
                }
              } else {
                taskData[field] = null; // Ensure null for undefined fields
              }
            });
            // Log individual task for debugging
            console.log('Processed task:', taskData);
            return taskData;
          });
          // Log all tasks for debugging
          console.log('Fetched tasks:', data);
          setTasks(data);
        },
        error => {
          console.error('Error fetching tasks:', error);
          Alert.alert('Error', 'Failed to load tasks');
        }
      );

    return unsubscribe;
  }, []);

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const user = firebase.auth().currentUser;
      await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('tasks')
        .doc(taskId)
        .update({ completed: !currentStatus });
    } catch (error) {
      Alert.alert('Update Failed', error.message);
    }
  };

  const deleteTask = async (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = firebase.auth().currentUser;
              await firebase.firestore()
                .collection('users')
                .doc(user.uid)
                .collection('tasks')
                .doc(taskId)
                .delete();
              Alert.alert('Task deleted');
            } catch (error) {
              Alert.alert('Delete Failed', error.message);
            }
          }
        }
      ]
    );
  };

  // Helper function to parse custom date string format
  const parseCustomDate = (dateStr) => {
    if (!dateStr || dateStr === 'Not Set' || typeof dateStr !== 'string') {
      return null; // Return null for invalid or non-string input
    }
    // Remove "UTC+5:30" and parse the rest
    const cleanStr = dateStr.replace(/UTC\+5:30$/, '').trim();
    const date = new Date(cleanStr);
    // Validate the date
    if (isNaN(date.getTime())) {
      console.warn('Failed to parse date:', dateStr, 'falling back to null');
      return null; // Fallback to null if parsing fails
    }
    return date;
  };

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return 'Not Set';
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (date && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else {
      dateObj = parseCustomDate(date);
    }
    if (!dateObj || isNaN(dateObj.getTime())) return 'Not Set';
    return dateObj.toLocaleString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }) + ' UTC+5:30';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        item.completed && styles.completedTask,
        { backgroundColor: isDark ? (item.completed ? '#1f2e1f' : '#1e293b') : (item.completed ? '#e0fce4' : '#ffffff') }
      ]}
      onPress={() => toggleComplete(item.id, item.completed)}
      onLongPress={() => deleteTask(item.id)}
      activeOpacity={0.85}
    >
      <Icon
        name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={26}
        color={item.completed ? '#22C55E' : '#3B82F6'}
        style={{ marginTop: 5 }}
      />
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.lineThrough, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
          {item.title || 'Untitled Task'}
        </Text>
        {item.description ? (
          <Text style={[styles.taskDesc, { color: isDark ? '#94a3b8' : '#475569' }]}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Icon name="layers-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>{item.category || 'General'}</Text>
        </View>
        {/* <View style={styles.metaRow}>
          <Icon name="flag-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>Priority: {item.priority || 'Not Set'}</Text>
        </View> */}
        <View style={styles.metaRow}>
          <Icon name="time-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>Duration: {item.duration || 'Not Set'} mins</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="calendar-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>Starts: {formatDate(item.startTime)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="calendar-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>Ends: {formatDate(item.endTime)}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: item.completed ? '#22C55E' : '#EF4444' }]}>
            {item.completed ? 'Completed' : 'Not Completed'}
          </Text>
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <Icon name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#F9FAFB' }]}>
      <Text style={[styles.heading, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>
        My Tasks
      </Text>

      {/* Task Summary */}
      <View style={[
        styles.summaryBox,
        { backgroundColor: isDark ? '#1e293b' : '#E0F2FE' }
      ]}>
        <View style={styles.summaryItem}>
          <Icon name="list-outline" size={20} color="#0EA5E9" />
          <Text style={styles.summaryText}>Total: {totalTasks}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Icon name="checkmark-done-outline" size={20} color="#22C55E" />
          <Text style={styles.summaryText}>Done: {completedTasks}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Icon name="time-outline" size={20} color="#F59E0B" />
          <Text style={styles.summaryText}>Pending: {pendingTasks}</Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={<Text style={{ color: isDark ? '#94a3b8' : '#475569', textAlign: 'center', marginTop: 20 }}>No tasks available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 15 },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a'
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  completedTask: {
    borderColor: '#22C55E'
  },
  taskContent: { marginLeft: 12, flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '700' },
  lineThrough: { textDecorationLine: 'line-through' },
  taskDesc: { fontSize: 13, marginTop: 2 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6
  },
  metaText: { fontSize: 12, color: '#475569' },
  statusRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusText: { fontSize: 13, fontWeight: '600' }
});