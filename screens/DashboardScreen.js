// // // import React, { useState, useCallback } from 'react';
// // // import {
// // //   View, Text, TouchableOpacity, StyleSheet, useColorScheme,
// // //   Alert, ScrollView, Dimensions, Image, StatusBar
// // // } from 'react-native';
// // // import { useFocusEffect } from '@react-navigation/native';
// // // import { firebase } from '../../firebase/firebaseConfig';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// // // import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// // // import { LineChart } from 'react-native-chart-kit';

// // // const screenWidth = Dimensions.get('window').width;

// // // export default function DashboardScreen({ navigation }) {
// // //   const theme = useColorScheme();
// // //   const [username, setUsername] = useState('User');
// // //   const [profileImageBase64, setProfileImageBase64] = useState(null);
// // //   const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
// // //   const [productivityData, setProductivityData] = useState([]); // Dynamic data
// // //   const [chartLabels, setChartLabels] = useState([]); // Dynamic labels

// // //   const user = firebase.auth().currentUser;

// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       if (!user) return;

// // //       const fetchUserData = async () => {
// // //         try {
// // //           const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
// // //           if (userDoc.exists) {
// // //             const data = userDoc.data();
// // //             setUsername(data?.username || 'User');
// // //             setProfileImageBase64(data?.photoBase64 || null);
// // //           }
// // //         } catch (error) {
// // //           console.error('Error fetching user data:', error);
// // //         }
// // //       };

// // //       const unsubscribe = firebase
// // //         .firestore()
// // //         .collection('users')
// // //         .doc(user.uid)
// // //         .collection('tasks')
// // //         .orderBy('createdAt', 'desc')
// // //         .onSnapshot(
// // //           (snapshot) => {
// // //             const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // //             const total = tasks.length;
// // //             const completed = tasks.filter((task) => task.completed).length;
// // //             const pending = total - completed;
// // //             setTaskStats({ total, completed, pending });

// // //             // Calculate analytics for the last 7 days
// // //             const today = new Date();
// // //             const sevenDaysAgo = new Date(today);
// // //             sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today

// // //             const dailyCompletion = Array(7).fill(0); // Array for 7 days
// // //             const labels = [];

// // //             tasks.forEach((task) => {
// // //               const createdAt = task.createdAt;
// // //               if (createdAt && typeof createdAt.toDate === 'function') { // Check if it's a Timestamp
// // //                 const taskDate = createdAt.toDate();
// // //                 if (taskDate >= sevenDaysAgo && taskDate <= today && task.completed) {
// // //                   const dayDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
// // //                   const index = 6 - dayDiff; // Reverse to align with chart (0 = oldest, 6 = today)
// // //                   if (index >= 0 && index < 7) {
// // //                     dailyCompletion[index] += 1;
// // //                   }
// // //                 }
// // //               } else {
// // //                 console.warn('Invalid createdAt for task:', task.id, createdAt);
// // //               }
// // //             });

// // //             // Generate labels (e.g., "Mon", "Tue", etc.)
// // //             for (let i = 6; i >= 0; i--) {
// // //               const date = new Date(today);
// // //               date.setDate(today.getDate() - i);
// // //               labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
// // //             }

// // //             setProductivityData(dailyCompletion);
// // //             setChartLabels(labels);
// // //           },
// // //           (error) => {
// // //             console.error('Error fetching tasks:', error);
// // //           }
// // //         );

// // //       fetchUserData();

// // //       return () => unsubscribe();
// // //     }, [user])
// // //   );

// // //   const handleVoiceCommand = async (command) => {
// // //     const lower = command.toLowerCase();
  
// // //     if (
// // //       lower.startsWith('add task') ||
// // //       lower.startsWith('create task') ||
// // //       lower.startsWith('new task')
// // //     ) {
// // //       try {
// // //         const user = firebase.auth().currentUser;
  
// // //         const stripped = lower.replace(/(add task|create task|new task)/, '').trim();
// // //         const parts = stripped.split(';').map(part => part.trim());
  
// // //         let title = '';
// // //         let description = '';
// // //         let startTime = '';
// // //         let endTime = '';
// // //         let priority = '';
  
// // //         parts.forEach(part => {
// // //           if (part.startsWith('description')) {
// // //             description = part.replace('description', '').trim();
// // //           } else if (part.startsWith('start')) {
// // //             startTime = part.replace('start', '').trim();
// // //           } else if (part.startsWith('end')) {
// // //             endTime = part.replace('end', '').trim();
// // //           } else if (part.startsWith('priority')) {
// // //             priority = part.replace('priority', '').trim();
// // //           } else {
// // //             title = part.trim();
// // //           }
// // //         });
  
// // //         if (!title) {
// // //           Alert.alert('Voice Input Error', 'Task title was not recognized.');
// // //           return;
// // //         }
  
// // //         const newTask = {
// // //           title,
// // //           description,
// // //           startTime,
// // //           endTime,
// // //           priority,
// // //           completed: false,
// // //           createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Ensure Timestamp
// // //         };
  
// // //         await firebase.firestore()
// // //           .collection('users')
// // //           .doc(user.uid)
// // //           .collection('tasks')
// // //           .add(newTask);
  
// // //         Alert.alert('Task Added', `"${title}" was added with voice input.`);
// // //       } catch (error) {
// // //         console.error('Error adding task:', error);
// // //         Alert.alert('Error', 'Could not add task.');
// // //       }
// // //     } else {
// // //       Alert.alert('Voice Command', `Command received: ${command}`);
// // //     }
// // //   };
  
// // //   const handleLogout = async () => {
// // //     try {
// // //       await firebase.auth().signOut();
// // //       navigation.replace('Login');
// // //     } catch (error) {
// // //       Alert.alert('Logout Error', error.message);
// // //     }
// // //   };

// // //   const greeting = () => {
// // //     const hour = new Date().getHours();
// // //     if (hour < 12) return 'Good morning';
// // //     if (hour < 18) return 'Good afternoon';
// // //     return 'Good evening';
// // //   };

// // //   return (
// // //     <ScrollView
// // //       style={[styles.container, theme === 'dark' ? styles.darkTheme : styles.lightTheme]}
// // //       contentContainerStyle={{ paddingBottom: 60 }}
// // //     >
// // //       <StatusBar backgroundColor="#1E293B" barStyle="light-content" />

// // //       {/* Header */}
// // //       <View style={styles.headerWrapper}>
// // //         <View style={styles.header}>
// // //           <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// // //             <Image
// // //               source={
// // //                 profileImageBase64
// // //                   ? { uri: `data:image/jpeg;base64,${profileImageBase64}` }
// // //                   : require('../assets/img4.png')
// // //               }
// // //               style={styles.profilePicLarge}
// // //             />
// // //           </TouchableOpacity>
// // //           <View style={{ marginLeft: 12 }}>
// // //             <Text style={styles.greetingText}>{greeting()},</Text>
// // //             <Text style={styles.usernameText}>{username} 👋</Text>
// // //           </View>
// // //           <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 'auto' }}>
// // //             <Icon name="log-out-outline" size={28} color="#EF4444" />
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>

// // //       {/* Task Stats */}
// // //       <View style={styles.cardSection}>
// // //         <Text style={styles.sectionTitle}>
// // //           <MaterialCommunityIcons name="clipboard-list-outline" size={20} /> Task Summary
// // //         </Text>
// // //         <View style={styles.statRow}>
// // //           <View style={styles.statCard}>
// // //             <FontAwesome5 name="tasks" size={24} color="#38BDF8" />
// // //             <Text style={styles.statLabel}>Total</Text>
// // //             <Text style={styles.statValue}>{taskStats.total}</Text>
// // //           </View>
// // //           <View style={styles.statCard}>
// // //             <FontAwesome5 name="check-circle" size={24} color="#22C55E" />
// // //             <Text style={styles.statLabel}>Completed</Text>
// // //             <Text style={styles.statValue}>{taskStats.completed}</Text>
// // //           </View>
// // //           <View style={styles.statCard}>
// // //             <FontAwesome5 name="clock" size={24} color="#FBBF24" />
// // //             <Text style={styles.statLabel}>Pending</Text>
// // //             <Text style={styles.statValue}>{taskStats.pending}</Text>
// // //           </View>
// // //         </View>
// // //       </View>

// // //       {/* Productivity Chart */}
// // //       <View style={styles.cardSection}>
// // //         <Text style={styles.sectionTitle}>
// // //           <MaterialCommunityIcons name="chart-line" size={20} /> Weekly Task Progress
// // //         </Text>
// // //         <View style={styles.chartCard}>
// // //           <LineChart
// // //             data={{
// // //               labels: chartLabels.length ? chartLabels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
// // //               datasets: [{ data: productivityData.length ? productivityData : [0, 0, 0, 0, 0, 0, 0] }],
// // //             }}
// // //             width={screenWidth - 60}
// // //             height={200}
// // //             yAxisLabel=""
// // //             chartConfig={{
// // //               backgroundGradientFrom: '#1E293B',
// // //               backgroundGradientTo: '#3B82F6',
// // //               decimalPlaces: 0,
// // //               color: () => '#fff',
// // //               labelColor: () => '#fff',
// // //               propsForDots: {
// // //                 r: '5',
// // //                 strokeWidth: '2',
// // //                 stroke: '#3B82F6',
// // //               },
// // //             }}
// // //             bezier
// // //             style={{ borderRadius: 10 }}
// // //           />
// // //           <Text style={styles.chartNote}>Tasks Completed Per Day (Last 7 Days)</Text>
// // //         </View>
// // //       </View>

// // //       {/* AI Suggestions */}
// // //       <View style={styles.cardSection}>
// // //         <Text style={styles.sectionTitle}>
// // //           <Icon name="bulb-outline" size={20} /> AI Suggestions
// // //         </Text>
// // //         <View style={styles.infoCard}>
// // //           <Text style={styles.cardText}>
// // //             <FontAwesome5 name="tasks" size={16} /> Priority Task: “Complete UI Review”
// // //           </Text>
// // //           <Text style={styles.cardSub}>Urgent | Estimated: 30 mins</Text>
// // //         </View>
// // //         <View style={styles.infoCard}>
// // //           <Text style={styles.cardText}>
// // //             <MaterialCommunityIcons name="clock-time-four-outline" size={16} /> Best Focus Time:
// // //             10:00 AM – 12:00 PM
// // //           </Text>
// // //           <Text style={styles.cardSub}>Based on past productivity</Text>
// // //         </View>
// // //       </View>

// // //       {/* Pomodoro Button */}
// // //       <View style={styles.cardSection}>
// // //         <Text style={styles.sectionTitle}>
// // //           <FontAwesome5 name="stopwatch" size={18} /> Focus Mode
// // //         </Text>
// // //         <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Pomodoro')}>
// // //           <Icon name="timer-outline" size={24} color="#fff" />
// // //           <Text style={styles.mainButtonText}>Start Pomodoro Timer</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Quick Access */}
// // //       <View style={styles.cardSection}>
// // //         <Text style={styles.sectionTitle}>
// // //           <MaterialCommunityIcons name="rocket-launch" size={18} /> Quick Access
// // //         </Text>
// // //         <View style={styles.actionsRow}>
// // //           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('AddTask')}>
// // //             <Icon name="add-circle-outline" size={20} color="#fff" />
// // //             <Text style={styles.secondaryButtonText}>Add Task</Text>
// // //           </TouchableOpacity>
// // //           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('TaskDetails')}>
// // //             <Icon name="list-outline" size={20} color="#fff" />
// // //             <Text style={styles.secondaryButtonText}>My Tasks</Text>
// // //           </TouchableOpacity>
// // //         </View>

// // //         <View style={{ marginTop: 12 }}>
// // //           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('VoiceInput')}>
// // //             <Icon name="mic-outline" size={20} color="#fff" />
// // //             <Text style={styles.secondaryButtonText}>Voice Assistant</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>
// // //     </ScrollView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   darkTheme: { backgroundColor: '#0F172A' },
// // //   lightTheme: { backgroundColor: '#F1F5F9' },

// // //   headerWrapper: { marginTop: 30, paddingHorizontal: 20, marginBottom: 15 },
// // //   header: { flexDirection: 'row', alignItems: 'center' },
// // //   greetingText: { fontSize: 14, color: '#94A3B8' },
// // //   usernameText: { fontSize: 18, fontWeight: 'bold', color: '#3B82F6' },

// // //   profilePicLarge: {
// // //     width: 55, height: 55, borderRadius: 27.5,
// // //     borderWidth: 2, borderColor: '#3B82F6', backgroundColor: '#e5e5e5'
// // //   },

// // //   cardSection: { paddingHorizontal: 20, marginBottom: 24 },
// // //   sectionTitle: {
// // //     fontSize: 17, fontWeight: 'bold', color: '#1E3A8A',
// // //     marginBottom: 10
// // //   },

// // //   statRow: { flexDirection: 'row', justifyContent: 'space-between' },
// // //   statCard: {
// // //     backgroundColor: '#1E293B', flex: 1, marginHorizontal: 4, padding: 16,
// // //     borderRadius: 12, alignItems: 'center', elevation: 3
// // //   },
// // //   statLabel: { color: '#CBD5E1', fontSize: 13, marginTop: 6 },
// // //   statValue: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginTop: 2 },

// // //   chartCard: {
// // //     backgroundColor: '#1E293B', padding: 10, borderRadius: 12,
// // //     alignItems: 'center'
// // //   },
// // //   chartNote: {
// // //     color: '#94A3B8',
// // //     fontSize: 12,
// // //     marginTop: 8,
// // //     textAlign: 'center'
// // //   },

// // //   infoCard: {
// // //     backgroundColor: '#1E293B', padding: 16, borderRadius: 12,
// // //     marginBottom: 12, elevation: 2
// // //   },
// // //   cardText: { fontSize: 15, fontWeight: '600', color: '#E2E8F0' },
// // //   cardSub: { marginTop: 4, fontSize: 12, color: '#94A3B8' },

// // //   mainButton: {
// // //     backgroundColor: '#5F7ADB', flexDirection: 'row', alignItems: 'center',
// // //     paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14,
// // //     elevation: 4, justifyContent: 'center', marginBottom: 10
// // //   },
// // //   mainButtonText: {
// // //     color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10
// // //   },

// // //   actionsRow: {
// // //     flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
// // //   },
// // //   secondaryButton: {
// // //     backgroundColor: '#3D5AFE', flexDirection: 'row', alignItems: 'center',
// // //     paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10,
// // //     elevation: 3, width: '48%', justifyContent: 'center'
// // //   },
// // //   secondaryButtonText: {
// // //     color: '#fff', marginLeft: 8, fontWeight: '600'
// // //   }
// // // });
// // import React, { useState, useCallback } from 'react';
// // import {
// //   View, Text, TouchableOpacity, StyleSheet, useColorScheme,
// //   Alert, ScrollView, Dimensions, Image, StatusBar
// // } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { firebase } from '../../firebase/firebaseConfig';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// // import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// // import { LineChart, PieChart } from 'react-native-chart-kit';

// // const screenWidth = Dimensions.get('window').width;

// // export default function DashboardScreen({ navigation }) {
// //   const theme = useColorScheme();
// //   const [username, setUsername] = useState('User');
// //   const [profileImageBase64, setProfileImageBase64] = useState(null);
// //   const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
// //   const [productivityData, setProductivityData] = useState([]); // Dynamic data
// //   const [chartLabels, setChartLabels] = useState([]); // Dynamic labels

// //   const user = firebase.auth().currentUser;

// //   useFocusEffect(
// //     useCallback(() => {
// //       if (!user) return;

// //       const fetchUserData = async () => {
// //         try {
// //           const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
// //           if (userDoc.exists) {
// //             const data = userDoc.data();
// //             setUsername(data?.username || 'User');
// //             setProfileImageBase64(data?.photoBase64 || null);
// //           }
// //         } catch (error) {
// //           console.error('Error fetching user data:', error);
// //         }
// //       };

// //       const unsubscribe = firebase
// //         .firestore()
// //         .collection('users')
// //         .doc(user.uid)
// //         .collection('tasks')
// //         .orderBy('createdAt', 'desc')
// //         .onSnapshot(
// //           (snapshot) => {
// //             const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //             const total = tasks.length;
// //             const completed = tasks.filter((task) => task.completed).length;
// //             const pending = total - completed;
// //             setTaskStats({ total, completed, pending });

// //             // Calculate analytics for the last 7 days
// //             const today = new Date();
// //             const sevenDaysAgo = new Date(today);
// //             sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today

// //             const dailyCompletion = Array(7).fill(0); // Array for 7 days
// //             const labels = [];

// //             tasks.forEach((task) => {
// //               const createdAt = task.createdAt;
// //               if (createdAt && typeof createdAt.toDate === 'function') { // Check if it's a Timestamp
// //                 const taskDate = createdAt.toDate();
// //                 if (taskDate >= sevenDaysAgo && taskDate <= today && task.completed) {
// //                   const dayDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
// //                   const index = 6 - dayDiff; // Reverse to align with chart (0 = oldest, 6 = today)
// //                   if (index >= 0 && index < 7) {
// //                     dailyCompletion[index] += 1;
// //                   }
// //                 }
// //               } else {
// //                 console.warn('Invalid createdAt for task:', task.id, createdAt);
// //               }
// //             });

// //             // Generate labels (e.g., "Mon", "Tue", etc.)
// //             for (let i = 6; i >= 0; i--) {
// //               const date = new Date(today);
// //               date.setDate(today.getDate() - i);
// //               labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
// //             }

// //             setProductivityData(dailyCompletion);
// //             setChartLabels(labels);
// //           },
// //           (error) => {
// //             console.error('Error fetching tasks:', error);
// //           }
// //         );

// //       fetchUserData();

// //       return () => unsubscribe();
// //     }, [user])
// //   );

// //   const handleVoiceCommand = async (command) => {
// //     const lower = command.toLowerCase();
  
// //     if (
// //       lower.startsWith('add task') ||
// //       lower.startsWith('create task') ||
// //       lower.startsWith('new task')
// //     ) {
// //       try {
// //         const user = firebase.auth().currentUser;
  
// //         const stripped = lower.replace(/(add task|create task|new task)/, '').trim();
// //         const parts = stripped.split(';').map(part => part.trim());
  
// //         let title = '';
// //         let description = '';
// //         let startTime = '';
// //         let endTime = '';
// //         let priority = '';
  
// //         parts.forEach(part => {
// //           if (part.startsWith('description')) {
// //             description = part.replace('description', '').trim();
// //           } else if (part.startsWith('start')) {
// //             startTime = part.replace('start', '').trim();
// //           } else if (part.startsWith('end')) {
// //             endTime = part.replace('end', '').trim();
// //           } else if (part.startsWith('priority')) {
// //             priority = part.replace('priority', '').trim();
// //           } else {
// //             title = part.trim();
// //           }
// //         });
  
// //         if (!title) {
// //           Alert.alert('Voice Input Error', 'Task title was not recognized.');
// //           return;
// //         }
  
// //         const newTask = {
// //           title,
// //           description,
// //           startTime,
// //           endTime,
// //           priority,
// //           completed: false,
// //           createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Ensure Timestamp
// //         };
  
// //         await firebase.firestore()
// //           .collection('users')
// //           .doc(user.uid)
// //           .collection('tasks')
// //           .add(newTask);
  
// //         Alert.alert('Task Added', `"${title}" was added with voice input.`);
// //       } catch (error) {
// //         console.error('Error adding task:', error);
// //         Alert.alert('Error', 'Could not add task.');
// //       }
// //     } else {
// //       Alert.alert('Voice Command', `Command received: ${command}`);
// //     }
// //   };
  
// //   const handleLogout = async () => {
// //     try {
// //       await firebase.auth().signOut();
// //       navigation.replace('Login');
// //     } catch (error) {
// //       Alert.alert('Logout Error', error.message);
// //     }
// //   };

// //   const greeting = () => {
// //     const hour = new Date().getHours();
// //     if (hour < 12) return 'Good morning';
// //     if (hour < 18) return 'Good afternoon';
// //     return 'Good evening';
// //   };

// //   return (
// //     <ScrollView
// //       style={[styles.container, theme === 'dark' ? styles.darkTheme : styles.lightTheme]}
// //       contentContainerStyle={{ paddingBottom: 60 }}
// //     >
// //       <StatusBar backgroundColor="#1E293B" barStyle="light-content" />

// //       {/* Header */}
// //       <View style={styles.headerWrapper}>
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// //             <Image
// //               source={
// //                 profileImageBase64
// //                   ? { uri: `data:image/jpeg;base64,${profileImageBase64}` }
// //                   : require('../assets/img4.png')
// //               }
// //               style={styles.profilePicLarge}
// //             />
// //           </TouchableOpacity>
// //           <View style={{ marginLeft: 12 }}>
// //             <Text style={styles.greetingText}>{greeting()},</Text>
// //             <Text style={styles.usernameText}>{username} 👋</Text>
// //           </View>
// //           <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 'auto' }}>
// //             <Icon name="log-out-outline" size={28} color="#EF4444" />
// //           </TouchableOpacity>
// //         </View>
// //       </View>

// //       {/* Task Stats */}
// //       <View style={styles.cardSection}>
// //         <Text style={styles.sectionTitle}>
// //           <MaterialCommunityIcons name="clipboard-list-outline" size={20} /> Task Summary
// //         </Text>
// //         <View style={styles.statRow}>
// //           <View style={styles.statCard}>
// //             <FontAwesome5 name="tasks" size={24} color="#38BDF8" />
// //             <Text style={styles.statLabel}>Total</Text>
// //             <Text style={styles.statValue}>{taskStats.total}</Text>
// //           </View>
// //           <View style={styles.statCard}>
// //             <FontAwesome5 name="check-circle" size={24} color="#22C55E" />
// //             <Text style={styles.statLabel}>Completed</Text>
// //             <Text style={styles.statValue}>{taskStats.completed}</Text>
// //           </View>
// //           <View style={styles.statCard}>
// //             <FontAwesome5 name="clock" size={24} color="#FBBF24" />
// //             <Text style={styles.statLabel}>Pending</Text>
// //             <Text style={styles.statValue}>{taskStats.pending}</Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Productivity Charts (Horizontally Swipeable) */}
// //       <View style={styles.cardSection}>
// //         <Text style={styles.sectionTitle}>
// //           <MaterialCommunityIcons name="chart-line" size={20} /> Productivity Insights
// //         </Text>
// //         <ScrollView
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           style={styles.chartContainer}
// //           contentContainerStyle={{ paddingHorizontal: 10 }}
// //         >
// //           {/* Line Chart (Weekly Task Progress) */}
// //           <View style={styles.chartCard}>
// //             <LineChart
// //               data={{
// //                 labels: chartLabels.length ? chartLabels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
// //                 datasets: [{ data: productivityData.length ? productivityData : [0, 0, 0, 0, 0, 0, 0] }],
// //               }}
// //               width={screenWidth - 60}
// //               height={200}
// //               yAxisLabel=""
// //               chartConfig={{
// //                 backgroundGradientFrom: '#1E293B',
// //                 backgroundGradientTo: '#3B82F6',
// //                 decimalPlaces: 0,
// //                 color: () => '#fff',
// //                 labelColor: () => '#fff',
// //                 propsForDots: {
// //                   r: '5',
// //                   strokeWidth: '2',
// //                   stroke: '#3B82F6',
// //                 },
// //               }}
// //               bezier
// //               style={{ borderRadius: 10 }}
// //             />
// //             <Text style={styles.chartNote}>Tasks Completed Per Day (Last 7 Days)</Text>
// //           </View>

// //           {/* Pie Chart (Tasks vs Completed) */}
// //           <View style={styles.chartCard}>
// //             <PieChart
// //               data={[
// //                 {
// //                   name: 'Completed',
// //                   population: taskStats.completed,
// //                   color: '#22C55E',
// //                   legendFontColor: '#fff',
// //                   legendFontSize: 12,
// //                 },
// //                 {
// //                   name: 'Total',
// //                   population: taskStats.total - taskStats.completed,
// //                   color: '#FBBF24',
// //                   legendFontColor: '#fff',
// //                   legendFontSize: 12,
// //                 },
// //               ]}
// //               width={screenWidth - 60}
// //               height={200}
// //               chartConfig={{
// //                 backgroundGradientFrom: '#1E293B',
// //                 backgroundGradientTo: '#3B82F6',
// //                 color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
// //               }}
// //               accessor="population"
// //               backgroundColor="transparent"
// //               paddingLeft="15"
// //               absolute
// //               style={{ borderRadius: 10 }}
// //             />
// //             <Text style={styles.chartNote}>Task Distribution (Completed vs Pending)</Text>
// //           </View>
// //         </ScrollView>
// //       </View>

// //       {/* AI Suggestions */}
// //       <View style={styles.cardSection}>
// //         <Text style={styles.sectionTitle}>
// //           <Icon name="bulb-outline" size={20} /> AI Suggestions
// //         </Text>
// //         <View style={styles.infoCard}>
// //           <Text style={styles.cardText}>
// //             <FontAwesome5 name="tasks" size={16} /> Priority Task: “Complete UI Review”
// //           </Text>
// //           <Text style={styles.cardSub}>Urgent | Estimated: 30 mins</Text>
// //         </View>
// //         <View style={styles.infoCard}>
// //           <Text style={styles.cardText}>
// //             <MaterialCommunityIcons name="clock-time-four-outline" size={16} /> Best Focus Time:
// //             10:00 AM – 12:00 PM
// //           </Text>
// //           <Text style={styles.cardSub}>Based on past productivity</Text>
// //         </View>
// //       </View>

// //       {/* Pomodoro Button */}
// //       <View style={styles.cardSection}>
// //         <Text style={styles.sectionTitle}>
// //           <FontAwesome5 name="stopwatch" size={18} /> Focus Mode
// //         </Text>
// //         <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Pomodoro')}>
// //           <Icon name="timer-outline" size={24} color="#fff" />
// //           <Text style={styles.mainButtonText}>Start Pomodoro Timer</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Quick Access */}
// //       <View style={styles.cardSection}>
// //         <Text style={styles.sectionTitle}>
// //           <MaterialCommunityIcons name="rocket-launch" size={18} /> Quick Access
// //         </Text>
// //         <View style={styles.actionsRow}>
// //           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('AddTask')}>
// //             <Icon name="add-circle-outline" size={20} color="#fff" />
// //             <Text style={styles.secondaryButtonText}>Add Task</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('TaskDetails')}>
// //             <Icon name="list-outline" size={20} color="#fff" />
// //             <Text style={styles.secondaryButtonText}>My Tasks</Text>
// //           </TouchableOpacity>
// //         </View>

// //         <View style={{ marginTop: 12 }}>
// //           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('VoiceInput')}>
// //             <Icon name="mic-outline" size={20} color="#fff" />
// //             <Text style={styles.secondaryButtonText}>Voice Assistant</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   darkTheme: { backgroundColor: '#0F172A' },
// //   lightTheme: { backgroundColor: '#F1F5F9' },

// //   headerWrapper: { marginTop: 30, paddingHorizontal: 20, marginBottom: 15 },
// //   header: { flexDirection: 'row', alignItems: 'center' },
// //   greetingText: { fontSize: 14, color: '#94A3B8' },
// //   usernameText: { fontSize: 18, fontWeight: 'bold', color: '#3B82F6' },

// //   profilePicLarge: {
// //     width: 55, height: 55, borderRadius: 27.5,
// //     borderWidth: 2, borderColor: '#3B82F6', backgroundColor: '#e5e5e5'
// //   },

// //   cardSection: { paddingHorizontal: 20, marginBottom: 24 },
// //   sectionTitle: {
// //     fontSize: 17, fontWeight: 'bold', color: '#1E3A8A',
// //     marginBottom: 10
// //   },

// //   statRow: { flexDirection: 'row', justifyContent: 'space-between' },
// //   statCard: {
// //     backgroundColor: '#1E293B', flex: 1, marginHorizontal: 4, padding: 16,
// //     borderRadius: 12, alignItems: 'center', elevation: 3
// //   },
// //   statLabel: { color: '#CBD5E1', fontSize: 13, marginTop: 6 },
// //   statValue: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginTop: 2 },

// //   chartContainer: { flexGrow: 0 },
// //   chartCard: {
// //     backgroundColor: '#1E293B', padding: 10, borderRadius: 12,
// //     alignItems: 'center', marginRight: 10, width: screenWidth - 60
// //   },
// //   chartNote: {
// //     color: '#94A3B8',
// //     fontSize: 12,
// //     marginTop: 8,
// //     textAlign: 'center'
// //   },

// //   infoCard: {
// //     backgroundColor: '#1E293B', padding: 16, borderRadius: 12,
// //     marginBottom: 12, elevation: 2
// //   },
// //   cardText: { fontSize: 15, fontWeight: '600', color: '#E2E8F0' },
// //   cardSub: { marginTop: 4, fontSize: 12, color: '#94A3B8' },

// //   mainButton: {
// //     backgroundColor: '#5F7ADB', flexDirection: 'row', alignItems: 'center',
// //     paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14,
// //     elevation: 4, justifyContent: 'center', marginBottom: 10
// //   },
// //   mainButtonText: {
// //     color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10
// //   },

// //   actionsRow: {
// //     flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
// //   },
// //   secondaryButton: {
// //     backgroundColor: '#3D5AFE', flexDirection: 'row', alignItems: 'center',
// //     paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10,
// //     elevation: 3, width: '48%', justifyContent: 'center'
// //   },
// //   secondaryButtonText: {
// //     color: '#fff', marginLeft: 8, fontWeight: '600'
// //   }
// // });
// import React, { useState, useCallback } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, useColorScheme,
//   Alert, ScrollView, Dimensions, Image, StatusBar
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { firebase } from '../../firebase/firebaseConfig';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { LineChart, PieChart } from 'react-native-chart-kit';
// import { Calendar } from 'react-native-calendars';

// const screenWidth = Dimensions.get('window').width;

// export default function DashboardScreen({ navigation }) {
//   const theme = useColorScheme();
//   const [username, setUsername] = useState('User');
//   const [profileImageBase64, setProfileImageBase64] = useState(null);
//   const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
//   const [productivityData, setProductivityData] = useState([]); // Dynamic data
//   const [chartLabels, setChartLabels] = useState([]); // Dynamic labels
//   const [markedDates, setMarkedDates] = useState({}); // State for calendar marked dates

//   const user = firebase.auth().currentUser;

//   useFocusEffect(
//     useCallback(() => {
//       if (!user) return;

//       const fetchUserData = async () => {
//         try {
//           const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
//           if (userDoc.exists) {
//             const data = userDoc.data();
//             setUsername(data?.username || 'User');
//             setProfileImageBase64(data?.photoBase64 || null);
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };

//       const unsubscribe = firebase
//         .firestore()
//         .collection('users')
//         .doc(user.uid)
//         .collection('tasks')
//         .orderBy('createdAt', 'desc')
//         .onSnapshot(
//           (snapshot) => {
//             const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//             const total = tasks.length;
//             const completed = tasks.filter((task) => task.completed).length;
//             const pending = total - completed;
//             setTaskStats({ total, completed, pending });

//             // Calculate analytics for the last 7 days
//             const today = new Date();
//             const sevenDaysAgo = new Date(today);
//             sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today

//             const dailyCompletion = Array(7).fill(0); // Array for 7 days
//             const labels = [];

//             // Map tasks to marked dates for calendar
//             const newMarkedDates = {};
//             tasks.forEach((task) => {
//               const createdAt = task.createdAt;
//               if (createdAt && typeof createdAt.toDate === 'function') {
//                 const taskDate = createdAt.toDate();
//                 const dateStr = taskDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
//                 newMarkedDates[dateStr] = { marked: true, dotColor: 'red' }; // Mark dates with tasks in red
//               } else {
//                 console.warn('Invalid createdAt for task:', task.id, createdAt);
//               }
//             });

//             tasks.forEach((task) => {
//               const createdAt = task.createdAt;
//               if (createdAt && typeof createdAt.toDate === 'function') {
//                 const taskDate = createdAt.toDate();
//                 if (taskDate >= sevenDaysAgo && taskDate <= today && task.completed) {
//                   const dayDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
//                   const index = 6 - dayDiff; // Reverse to align with chart (0 = oldest, 6 = today)
//                   if (index >= 0 && index < 7) {
//                     dailyCompletion[index] += 1;
//                   }
//                 }
//               }
//             });

//             // Generate labels (e.g., "Mon", "Tue", etc.)
//             for (let i = 6; i >= 0; i--) {
//               const date = new Date(today);
//               date.setDate(today.getDate() - i);
//               labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
//             }

//             setProductivityData(dailyCompletion);
//             setChartLabels(labels);
//             setMarkedDates(newMarkedDates);
//           },
//           (error) => {
//             console.error('Error fetching tasks:', error);
//           }
//         );

//       fetchUserData();

//       return () => unsubscribe();
//     }, [user])
//   );

//   const handleVoiceCommand = async (command) => {
//     const lower = command.toLowerCase();
  
//     if (
//       lower.startsWith('add task') ||
//       lower.startsWith('create task') ||
//       lower.startsWith('new task')
//     ) {
//       try {
//         const user = firebase.auth().currentUser;
  
//         const stripped = lower.replace(/(add task|create task|new task)/, '').trim();
//         const parts = stripped.split(';').map(part => part.trim());
  
//         let title = '';
//         let description = '';
//         let startTime = '';
//         let endTime = '';
//         let priority = '';
  
//         parts.forEach(part => {
//           if (part.startsWith('description')) {
//             description = part.replace('description', '').trim();
//           } else if (part.startsWith('start')) {
//             startTime = part.replace('start', '').trim();
//           } else if (part.startsWith('end')) {
//             endTime = part.replace('end', '').trim();
//           } else if (part.startsWith('priority')) {
//             priority = part.replace('priority', '').trim();
//           } else {
//             title = part.trim();
//           }
//         });
  
//         if (!title) {
//           Alert.alert('Voice Input Error', 'Task title was not recognized.');
//           return;
//         }
  
//         const newTask = {
//           title,
//           description,
//           startTime,
//           endTime,
//           priority,
//           completed: false,
//           createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Ensure Timestamp
//         };
  
//         await firebase.firestore()
//           .collection('users')
//           .doc(user.uid)
//           .collection('tasks')
//           .add(newTask);
  
//         Alert.alert('Task Added', `"${title}" was added with voice input.`);
//       } catch (error) {
//         console.error('Error adding task:', error);
//         Alert.alert('Error', 'Could not add task.');
//       }
//     } else {
//       Alert.alert('Voice Command', `Command received: ${command}`);
//     }
//   };
  
//   const handleLogout = async () => {
//     try {
//       await firebase.auth().signOut();
//       navigation.replace('Login');
//     } catch (error) {
//       Alert.alert('Logout Error', error.message);
//     }
//   };

//   const greeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 18) return 'Good afternoon';
//     return 'Good evening';
//   };

//   return (
//     <ScrollView
//       style={[styles.container, theme === 'dark' ? styles.darkTheme : styles.lightTheme]}
//       contentContainerStyle={{ paddingBottom: 60 }}
//     >
//       <StatusBar backgroundColor="#1E293B" barStyle="light-content" />

//       {/* Header */}
//       <View style={styles.headerWrapper}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//             <Image
//               source={
//                 profileImageBase64
//                   ? { uri: `data:image/jpeg;base64,${profileImageBase64}` }
//                   : require('../assets/img4.png')
//               }
//               style={styles.profilePicLarge}
//             />
//           </TouchableOpacity>
//           <View style={{ marginLeft: 12 }}>
//             <Text style={styles.greetingText}>{greeting()},</Text>
//             <Text style={styles.usernameText}>{username} 👋</Text>
//           </View>
//           <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 'auto' }}>
//             <Icon name="log-out-outline" size={28} color="#EF4444" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Task Stats */}
//       <View style={styles.cardSection}>
//         <Text style={styles.sectionTitle}>
//           <MaterialCommunityIcons name="clipboard-list-outline" size={20} /> Task Summary
//         </Text>
//         <View style={styles.statRow}>
//           <View style={styles.statCard}>
//             <FontAwesome5 name="tasks" size={24} color="#38BDF8" />
//             <Text style={styles.statLabel}>Total</Text>
//             <Text style={styles.statValue}>{taskStats.total}</Text>
//           </View>
//           <View style={styles.statCard}>
//             <FontAwesome5 name="check-circle" size={24} color="#22C55E" />
//             <Text style={styles.statLabel}>Completed</Text>
//             <Text style={styles.statValue}>{taskStats.completed}</Text>
//           </View>
//           <View style={styles.statCard}>
//             <FontAwesome5 name="clock" size={24} color="#FBBF24" />
//             <Text style={styles.statLabel}>Pending</Text>
//             <Text style={styles.statValue}>{taskStats.pending}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Productivity Charts (Horizontally Swipeable) */}
//       <View style={styles.cardSection}>
//         <Text style={styles.sectionTitle}>
//           <MaterialCommunityIcons name="chart-line" size={20} /> Productivity Insights
//         </Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.chartContainer}
//           contentContainerStyle={{ paddingHorizontal: 10 }}
//         >
//           {/* Line Chart (Weekly Task Progress) */}
//           <View style={styles.chartCard}>
//             <LineChart
//               data={{
//                 labels: chartLabels.length ? chartLabels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//                 datasets: [{ data: productivityData.length ? productivityData : [0, 0, 0, 0, 0, 0, 0] }],
//               }}
//               width={screenWidth - 60}
//               height={200}
//               yAxisLabel=""
//               chartConfig={{
//                 backgroundGradientFrom: '#1E293B',
//                 backgroundGradientTo: '#3B82F6',
//                 decimalPlaces: 0,
//                 color: () => '#fff',
//                 labelColor: () => '#fff',
//                 propsForDots: {
//                   r: '5',
//                   strokeWidth: '2',
//                   stroke: '#3B82F6',
//                 },
//               }}
//               bezier
//               style={{ borderRadius: 10 }}
//             />
//             <Text style={styles.chartNote}>Tasks Completed Per Day (Last 7 Days)</Text>
//           </View>

//           {/* Pie Chart (Tasks vs Completed) */}
//           <View style={styles.chartCard}>
//             <PieChart
//               data={[
//                 {
//                   name: 'Completed',
//                   population: taskStats.completed,
//                   color: '#22C55E',
//                   legendFontColor: '#fff',
//                   legendFontSize: 12,
//                 },
//                 {
//                   name: 'Total',
//                   population: taskStats.total - taskStats.completed,
//                   color: '#FBBF24',
//                   legendFontColor: '#fff',
//                   legendFontSize: 12,
//                 },
//               ]}
//               width={screenWidth - 60}
//               height={200}
//               chartConfig={{
//                 backgroundGradientFrom: '#1E293B',
//                 backgroundGradientTo: '#3B82F6',
//                 color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               }}
//               accessor="population"
//               backgroundColor="transparent"
//               paddingLeft="15"
//               absolute
//               style={{ borderRadius: 10 }}
//             />
//             <Text style={styles.chartNote}>Task Distribution (Completed vs Pending)</Text>
//           </View>
//         </ScrollView>
//       </View>

//       {/* Calendar Section */}
//       <View style={styles.cardSection}>
//         <Text style={styles.sectionTitle}>
//           <MaterialCommunityIcons name="calendar-month" size={20} /> Task Calendar
//         </Text>
//         <View style={styles.calendarCard}>
//           <Calendar
//             markedDates={markedDates}
//             markingType={'dot'}
//             theme={{
//               backgroundColor: '#1E293B',
//               calendarBackground: '#1E293B',
//               textSectionTitleColor: '#fff',
//               selectedDayBackgroundColor: '#3B82F6',
//               selectedDayTextColor: '#fff',
//               todayTextColor: '#3B82F6',
//               dayTextColor: '#E2E8F0',
//               textDisabledColor: '#94A3B8',
//               dotColor: '#EF4444', // Default dot color (red for tasks)
//               selectedDotColor: '#fff',
//               arrowColor: '#fff',
//               monthTextColor: '#fff',
//               indicatorColor: '#3B82F6',
//             }}
//             style={{ borderRadius: 10 }}
//           />
//         </View>
//       </View>

//       {/* AI Suggestions */}
//       <View style={styles.cardSection}>
//         <Text style={styles.sectionTitle}>
//           <Icon name="bulb-outline" size={20} /> AI Suggestions
//         </Text>
//         <View style={styles.infoCard}>
//           <Text style={styles.cardText}>
//             <FontAwesome5 name="tasks" size={16} /> Priority Task: “Complete UI Review”
//           </Text>
//           <Text style={styles.cardSub}>Urgent | Estimated: 30 mins</Text>
//         </View>
//         <View style={styles.infoCard}>
//           <Text style={styles.cardText}>
//             <MaterialCommunityIcons name="clock-time-four-outline" size={16} /> Best Focus Time:
//             10:00 AM – 12:00 PM
//           </Text>
//           <Text style={styles.cardSub}>Based on past productivity</Text>
//         </View>
//       </View>

//       {/* Pomodoro Button */}
//       <View style={styles.cardSection}>
//         <Text style={styles.sectionTitle}>
//           <FontAwesome5 name="stopwatch" size={18} /> Focus Mode
//         </Text>
//         <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Pomodoro')}>
//           <Icon name="timer-outline" size={24} color="#fff" />
//           <Text style={styles.mainButtonText}>Start Pomodoro Timer</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Quick Access */}
//       <View style={styles.cardSection}>
//         <Text style={styles.sectionTitle}>
//           <MaterialCommunityIcons name="rocket-launch" size={18} /> Quick Access
//         </Text>
//         <View style={styles.actionsRow}>
//           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('AddTask')}>
//             <Icon name="add-circle-outline" size={20} color="#fff" />
//             <Text style={styles.secondaryButtonText}>Add Task</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('TaskDetails')}>
//             <Icon name="list-outline" size={20} color="#fff" />
//             <Text style={styles.secondaryButtonText}>My Tasks</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ marginTop: 12 }}>
//           <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('VoiceInput')}>
//             <Icon name="mic-outline" size={20} color="#fff" />
//             <Text style={styles.secondaryButtonText}>Voice Assistant</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   darkTheme: { backgroundColor: '#0F172A' },
//   lightTheme: { backgroundColor: '#F1F5F9' },

//   headerWrapper: { marginTop: 30, paddingHorizontal: 20, marginBottom: 15 },
//   header: { flexDirection: 'row', alignItems: 'center' },
//   greetingText: { fontSize: 14, color: '#94A3B8' },
//   usernameText: { fontSize: 18, fontWeight: 'bold', color: '#3B82F6' },

//   profilePicLarge: {
//     width: 55, height: 55, borderRadius: 27.5,
//     borderWidth: 2, borderColor: '#3B82F6', backgroundColor: '#e5e5e5'
//   },

//   cardSection: { paddingHorizontal: 20, marginBottom: 24 },
//   sectionTitle: {
//     fontSize: 17, fontWeight: 'bold', color: '#1E3A8A',
//     marginBottom: 10
//   },

//   statRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   statCard: {
//     backgroundColor: '#1E293B', flex: 1, marginHorizontal: 4, padding: 16,
//     borderRadius: 12, alignItems: 'center', elevation: 3
//   },
//   statLabel: { color: '#CBD5E1', fontSize: 13, marginTop: 6 },
//   statValue: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginTop: 2 },

//   chartContainer: { flexGrow: 0 },
//   chartCard: {
//     backgroundColor: '#1E293B', padding: 10, borderRadius: 12,
//     alignItems: 'center', marginRight: 10, width: screenWidth - 60
//   },
//   chartNote: {
//     color: '#94A3B8',
//     fontSize: 12,
//     marginTop: 8,
//     textAlign: 'center'
//   },

//   calendarCard: {
//     backgroundColor: '#1E293B',
//     borderRadius: 12,
//     padding: 10,
//     elevation: 3,
//   },

//   infoCard: {
//     backgroundColor: '#1E293B', padding: 16, borderRadius: 12,
//     marginBottom: 12, elevation: 2
//   },
//   cardText: { fontSize: 15, fontWeight: '600', color: '#E2E8F0' },
//   cardSub: { marginTop: 4, fontSize: 12, color: '#94A3B8' },

//   mainButton: {
//     backgroundColor: '#5F7ADB', flexDirection: 'row', alignItems: 'center',
//     paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14,
//     elevation: 4, justifyContent: 'center', marginBottom: 10
//   },
//   mainButtonText: {
//     color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10
//   },

//   actionsRow: {
//     flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
//   },
//   secondaryButton: {
//     backgroundColor: '#3D5AFE', flexDirection: 'row', alignItems: 'center',
//     paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10,
//     elevation: 3, width: '48%', justifyContent: 'center'
//   },
//   secondaryButtonText: {
//     color: '#fff', marginLeft: 8, fontWeight: '600'
//   }
// });
import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, useColorScheme,
  Alert, ScrollView, Dimensions, Image, StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { firebase } from '../../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini API

const screenWidth = Dimensions.get('window').width;

// Hardcoded Gemini API Key (for development only)
const GEMINI_API_KEY = 'AIzaSyCd1SqSCQwmbDa1e4NnXM8U1xiY-5D9TeY'; // Your API key

export default function DashboardScreen({ navigation }) {
  const theme = useColorScheme();
  const [username, setUsername] = useState('User');
  const [profileImageBase64, setProfileImageBase64] = useState(null);
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [productivityData, setProductivityData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState([]); // State for AI suggestions

  const user = firebase.auth().currentUser;

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Try this model

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const fetchUserData = async () => {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUsername(data?.username || 'User');
            setProfileImageBase64(data?.photoBase64 || null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      const unsubscribe = firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('tasks')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          async (snapshot) => {
            const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const total = tasks.length;
            const completed = tasks.filter((task) => task.completed).length;
            const pending = total - completed;
            setTaskStats({ total, completed, pending });

            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6);

            const dailyCompletion = Array(7).fill(0);
            const labels = [];
            const newMarkedDates = {};

            tasks.forEach((task) => {
              const createdAt = task.createdAt;
              if (createdAt && typeof createdAt.toDate === 'function') {
                const taskDate = createdAt.toDate();
                const dateStr = taskDate.toISOString().split('T')[0];
                newMarkedDates[dateStr] = { marked: true, dotColor: 'red' };
              }
            });

            tasks.forEach((task) => {
              const createdAt = task.createdAt;
              if (createdAt && typeof createdAt.toDate === 'function') {
                const taskDate = createdAt.toDate();
                if (taskDate >= sevenDaysAgo && taskDate <= today && task.completed) {
                  const dayDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
                  const index = 6 - dayDiff;
                  if (index >= 0 && index < 7) {
                    dailyCompletion[index] += 1;
                  }
                }
              }
            });

            for (let i = 6; i >= 0; i--) {
              const date = new Date(today);
              date.setDate(today.getDate() - i);
              labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            }

            setProductivityData(dailyCompletion);
            setChartLabels(labels);
            setMarkedDates(newMarkedDates);

            // Fetch AI suggestions based on task descriptions
            await fetchAiSuggestions(tasks.filter(task => !task.completed), total, completed, pending);
          },
          (error) => {
            console.error('Error fetching tasks:', error);
          }
        );

      fetchUserData();

      return () => unsubscribe();
    }, [user])
  );

  // Function to fetch AI suggestions from Gemini API based on task descriptions
  const fetchAiSuggestions = async (pendingTasks, total, completed, pending) => {
    try {
      const taskDescriptions = pendingTasks.map(task => ({
        title: task.title,
        description: task.description || 'No description',
      })).filter(task => task.description); // Filter out tasks without descriptions

      if (taskDescriptions.length === 0) {
        setAiSuggestions([{ task: 'No tasks with descriptions to analyze', priority: 'Low', reason: 'Add descriptions to tasks for better suggestions.' }]);
        return;
      }

      const prompt = `
        You are an AI productivity assistant for a task management app. Based on the following pending tasks:
        ${taskDescriptions.map((task, index) => `
          Task ${index + 1}: Title: ${task.title}, Description: ${task.description}
        `).join('\n')}
        Analyze the descriptions and suggest which task should be prioritized, providing:
        - 2-3 prioritized tasks
        - Priority: [High/Medium/Low]
        - Reason: [Brief explanation based on description analysis]
        Format each suggestion as:
        - Task: [Task title]
        - Priority: [High/Medium/Low]
        - Reason: [Explanation]
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const suggestions = responseText
        .split('- Task:')
        .filter(s => s.trim())
        .map(s => {
          const lines = s.trim().split('\n');
          return {
            task: lines[0].trim(),
            priority: lines.find(l => l.includes('Priority:'))?.replace('Priority:', '').trim() || 'Medium',
            reason: lines.find(l => l.includes('Reason:'))?.replace('Reason:', '').trim() || 'No specific reason',
          };
        });

      setAiSuggestions(suggestions.length > 0 ? suggestions : [{ task: 'No valid suggestions generated', priority: 'Low', reason: 'Check prompt or model response.' }]);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      // Fallback to another model if gemini-2.0-flash fails
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
        const result = await fallbackModel.generateContent(prompt);
        const responseText = result.response.text();
        const suggestions = responseText
          .split('- Task:')
          .filter(s => s.trim())
          .map(s => {
            const lines = s.trim().split('\n');
            return {
              task: lines[0].trim(),
              priority: lines.find(l => l.includes('Priority:'))?.replace('Priority:', '').trim() || 'Medium',
              reason: lines.find(l => l.includes('Reason:'))?.replace('Reason:', '').trim() || 'No specific reason',
            };
          });
        setAiSuggestions(suggestions.length > 0 ? suggestions : [{ task: 'Fallback failed', priority: 'Low', reason: 'Check API configuration.' }]);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setAiSuggestions([{ task: 'No suggestions available', priority: 'High', reason: 'Check API key or model availability.' }]);
      }
    }
  };

  const handleVoiceCommand = async (command) => {
    const lower = command.toLowerCase();

    if (
      lower.startsWith('add task') ||
      lower.startsWith('create task') ||
      lower.startsWith('new task')
    ) {
      try {
        const user = firebase.auth().currentUser;

        const stripped = lower.replace(/(add task|create task|new task)/, '').trim();
        const parts = stripped.split(';').map(part => part.trim());

        let title = '';
        let description = '';
        let startTime = '';
        let endTime = '';
        let priority = '';

        parts.forEach(part => {
          if (part.startsWith('description')) {
            description = part.replace('description', '').trim();
          } else if (part.startsWith('start')) {
            startTime = part.replace('start', '').trim();
          } else if (part.startsWith('end')) {
            endTime = part.replace('end', '').trim();
          } else if (part.startsWith('priority')) {
            priority = part.replace('priority', '').trim();
          } else {
            title = part.trim();
          }
        });

        if (!title) {
          Alert.alert('Voice Input Error', 'Task title was not recognized.');
          return;
        }

        const newTask = {
          title,
          description,
          startTime,
          endTime,
          priority,
          completed: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .collection('tasks')
          .add(newTask);

        Alert.alert('Task Added', `"${title}" was added with voice input.`);
      } catch (error) {
        console.error('Error adding task:', error);
        Alert.alert('Error', 'Could not add task.');
      }
    } else {
      Alert.alert('Voice Command', `Command received: ${command}`);
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get priority color based on level
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#EF4444'; // Red
      case 'medium': return '#FBBF24'; // Yellow
      case 'low': return '#22C55E'; // Green
      default: return '#94A3B8'; // Gray
    }
  };

  return (
    <ScrollView
      style={[styles.container, theme === 'dark' ? styles.darkTheme : styles.lightTheme]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <StatusBar backgroundColor="#1E293B" barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={
                profileImageBase64
                  ? { uri: `data:image/jpeg;base64,${profileImageBase64}` }
                  : require('../assets/img4.png')
              }
              style={styles.profilePicLarge}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greetingText}>{greeting()},</Text>
            <Text style={styles.usernameText}>{username} 👋</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 'auto' }}>
            <Icon name="log-out-outline" size={28} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Task Stats */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="clipboard-list-outline" size={20} /> Task Summary
        </Text>
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <FontAwesome5 name="tasks" size={24} color="#38BDF8" />
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{taskStats.total}</Text>
          </View>
          <View style={styles.statCard}>
            <FontAwesome5 name="check-circle" size={24} color="#22C55E" />
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{taskStats.completed}</Text>
          </View>
          <View style={styles.statCard}>
            <FontAwesome5 name="clock" size={24} color="#FBBF24" />
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statValue}>{taskStats.pending}</Text>
          </View>
        </View>
      </View>

      {/* Productivity Charts */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="chart-line" size={20} /> Productivity Insights
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chartContainer}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          <View style={styles.chartCard}>
            <LineChart
              data={{
                labels: chartLabels.length ? chartLabels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: productivityData.length ? productivityData : [0, 0, 0, 0, 0, 0, 0] }],
              }}
              width={screenWidth - 60}
              height={200}
              yAxisLabel=""
              chartConfig={{
                backgroundGradientFrom: '#1E293B',
                backgroundGradientTo: '#3B82F6',
                decimalPlaces: 0,
                color: () => '#fff',
                labelColor: () => '#fff',
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#3B82F6',
                },
              }}
              bezier
              style={{ borderRadius: 10 }}
            />
            <Text style={styles.chartNote}>Tasks Completed Per Day (Last 7 Days)</Text>
          </View>
          <View style={styles.chartCard}>
            <PieChart
              data={[
                {
                  name: 'Completed',
                  population: taskStats.completed,
                  color: '#22C55E',
                  legendFontColor: '#fff',
                  legendFontSize: 12,
                },
                {
                  name: 'Total',
                  population: taskStats.total - taskStats.completed,
                  color: '#FBBF24',
                  legendFontColor: '#fff',
                  legendFontSize: 12,
                },
              ]}
              width={screenWidth - 60}
              height={200}
              chartConfig={{
                backgroundGradientFrom: '#1E293B',
                backgroundGradientTo: '#3B82F6',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{ borderRadius: 10 }}
            />
            <Text style={styles.chartNote}>Task Distribution (Completed vs Pending)</Text>
          </View>
        </ScrollView>
      </View>

      {/* Calendar Section */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="calendar-month" size={20} /> Task Calendar
        </Text>
        <View style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            markingType={'dot'}
            theme={{
              backgroundColor: '#1E293B',
              calendarBackground: '#1E293B',
              textSectionTitleColor: '#fff',
              selectedDayBackgroundColor: '#3B82F6',
              selectedDayTextColor: '#fff',
              todayTextColor: '#3B82F6',
              dayTextColor: '#E2E8F0',
              textDisabledColor: '#94A3B8',
              dotColor: '#EF4444',
              selectedDotColor: '#fff',
              arrowColor: '#fff',
              monthTextColor: '#fff',
              indicatorColor: '#3B82F6',
            }}
            style={{ borderRadius: 10 }}
          />
        </View>
      </View>

      {/* AI Suggestions */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>
          <Icon name="bulb-outline" size={20} /> AI Suggestions
        </Text>
        {aiSuggestions.length > 0 ? (
          aiSuggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionCard}>
              <View style={styles.priorityDot} backgroundColor={getPriorityColor(suggestion.priority)} />
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionTask}>
                  <FontAwesome5 name="tasks" size={16} /> {suggestion.task}
                </Text>
                <Text style={styles.suggestionPriority}>
                  Priority: <Text style={{ color: getPriorityColor(suggestion.priority) }}>{suggestion.priority}</Text>
                </Text>
                <Text style={styles.suggestionReason}>Reason: {suggestion.reason}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.cardText}>Loading suggestions...</Text>
          </View>
        )}
      </View>

      {/* Pomodoro Button */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>
          <FontAwesome5 name="stopwatch" size={18} /> Focus Mode
        </Text>
        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Pomodoro')}>
          <Icon name="timer-outline" size={24} color="#fff" />
          <Text style={styles.mainButtonText}>Start Pomodoro Timer</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Access */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="rocket-launch" size={18} /> Quick Access
        </Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('AddTask')}>
            <Icon name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.secondaryButtonText}>Add Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('TaskDetails')}>
            <Icon name="list-outline" size={20} color="#fff" />
            <Text style={styles.secondaryButtonText}>My Tasks</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('VoiceInput')}>
            <Icon name="mic-outline" size={20} color="#fff" />
            <Text style={styles.secondaryButtonText}>Voice Assistant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkTheme: { backgroundColor: '#0F172A' },
  lightTheme: { backgroundColor: '#F1F5F9' },

  headerWrapper: { marginTop: 30, paddingHorizontal: 20, marginBottom: 15 },
  header: { flexDirection: 'row', alignItems: 'center' },
  greetingText: { fontSize: 14, color: '#94A3B8' },
  usernameText: { fontSize: 18, fontWeight: 'bold', color: '#3B82F6' },

  profilePicLarge: {
    width: 55, height: 55, borderRadius: 27.5,
    borderWidth: 2, borderColor: '#3B82F6', backgroundColor: '#e5e5e5'
  },

  cardSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: {
    fontSize: 17, fontWeight: 'bold', color: '#1E3A8A',
    marginBottom: 10
  },

  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: '#1E293B', flex: 1, marginHorizontal: 4, padding: 16,
    borderRadius: 12, alignItems: 'center', elevation: 3
  },
  statLabel: { color: '#CBD5E1', fontSize: 13, marginTop: 6 },
  statValue: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginTop: 2 },

  chartContainer: { flexGrow: 0 },
  chartCard: {
    backgroundColor: '#1E293B', padding: 10, borderRadius: 12,
    alignItems: 'center', marginRight: 10, width: screenWidth - 60
  },
  chartNote: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center'
  },

  calendarCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },

  infoCard: {
    backgroundColor: '#1E293B', padding: 16, borderRadius: 12,
    marginBottom: 12, elevation: 2
  },
  cardText: { fontSize: 15, fontWeight: '600', color: '#E2E8F0' },

  suggestionCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTask: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  suggestionPriority: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  suggestionReason: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
  },

  mainButton: {
    backgroundColor: '#5F7ADB', flexDirection: 'row', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14,
    elevation: 4, justifyContent: 'center', marginBottom: 10
  },
  mainButtonText: {
    color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10
  },

  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
  },
  secondaryButton: {
    backgroundColor: '#3D5AFE', flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10,
    elevation: 3, width: '48%', justifyContent: 'center'
  },
  secondaryButtonText: {
    color: '#fff', marginLeft: 8, fontWeight: '600'
  }
});