import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useState, useEffect } from 'react';
import {
  ChevronRight,
  Moon,
  Bell,
  Download,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const { signOut } = useAuthStore();
  
  // Get store data and clear functions
  const { groups, expenses, clearAllData } = useStore();

  // Load notification preference when component mounts
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  // Load notification settings from storage
  const loadNotificationSettings = async () => {
    try {
      const notificationEnabled = await AsyncStorage.getItem('notificationsEnabled');
      if (notificationEnabled !== null) {
        setNotifications(notificationEnabled === 'true');
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  // Save notification settings to storage
  const saveNotificationSettings = async (value) => {
    try {
      await AsyncStorage.setItem('notificationsEnabled', value.toString());
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  // Request notification permissions
  const requestNotificationPermissions = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive expense reminders.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } else {
      Alert.alert('Notifications not available', 'Notifications require a physical device.');
      return false;
    }
  };

  // Schedule a weekly expense reminder notification
  const scheduleExpenseReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear existing notifications
    
    // Schedule weekly notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Expense Tracker Reminder",
        body: "Don't forget to track your expenses this week!",
        data: { screen: 'expenses' },
      },
      trigger: {
        weekday: 1, // Monday
        hour: 9, // 9 AM
        minute: 0,
        repeats: true,
      },
    });
    
    // Schedule monthly notification for budget review
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Monthly Budget Review",
        body: "It's time to review your monthly expenses and budget.",
        data: { screen: 'reports' },
      },
      trigger: {
        day: 1, // First day of month
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });
  };

  // Handle notification toggle
  const handleToggleNotifications = async (value) => {
    if (value) {
      const permissionGranted = await requestNotificationPermissions();
      if (permissionGranted) {
        await scheduleExpenseReminder();
        setNotifications(true);
        saveNotificationSettings(true);
      } else {
        // Reset switch if permissions weren't granted
        setNotifications(false);
        saveNotificationSettings(false);
      }
    } else {
      // Cancel all notifications if toggle is turned off
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotifications(false);
      saveNotificationSettings(false);
    }
  };

  // Function to handle data clearing with confirmation
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to remove all expenses and groups? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear Data", 
          onPress: () => {
            clearAllData();
            Alert.alert("Success", "All data has been cleared successfully.");
          },
          style: "destructive"
        }
      ]
    );
  };

  // Function to export data
  const handleExportData = async () => {
    try {
      // Prepare data to export
      const exportData = {
        groups,
        expenses,
        exportDate: new Date().toISOString(),
        appVersion: "1.0.0"
      };
      
      // Convert to JSON string
      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Create a temporary file
      const fileUri = `${FileSystem.cacheDirectory}expense_tracker_data.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonData);
      
      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        // Share the file
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Expense Tracker Data',
          UTI: 'public.json'
        });
      } else {
        // Fallback if sharing isn't available
        Alert.alert(
          "Sharing Not Available",
          "File sharing is not available on this device."
        );
      }
    } catch (error) {
      Alert.alert(
        "Export Failed",
        "There was an error exporting your data. Please try again."
      );
      console.error("Export error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Moon size={24} color="#64748b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch to dark theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
              thumbColor={isDarkMode ? '#fff' : '#fff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={24} color="#64748b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Get expense reminders
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
              thumbColor={notifications ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {notifications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Settings</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Weekly Reminder</Text>
                <Text style={styles.settingDescription}>
                  Receive weekly expense tracking reminders on Monday at 9:00 AM
                </Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Monthly Budget Review</Text>
                <Text style={styles.settingDescription}>
                  Get a reminder on the 1st of each month at 10:00 AM
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingIcon}>
              <Download size={24} color="#64748b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Download your expense history
              </Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleClearData}
          >
            <View style={styles.settingIcon}>
              <Trash2 size={24} color="#dc2626" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>
                Clear Data
              </Text>
              <Text style={styles.settingDescription}>
                Remove all expenses and groups
              </Text>
            </View>
            <ChevronRight size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem} onPress={signOut}>
            <View style={styles.settingIcon}>
              <LogOut size={24} color="#ef4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: '#ef4444' }]}>
                Sign Out
              </Text>
              <Text style={styles.settingDescription}>
                Log out of your account
              </Text>
            </View>
            <ChevronRight size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutContainer}>
            <Text style={styles.appName}>Expense Tracker</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <TouchableOpacity>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginTop: 48,
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    marginBottom: 16,
    paddingLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  dangerItem: {
    borderColor: '#fee2e2',
    borderWidth: 1,
  },
  dangerText: {
    color: '#dc2626',
  },
  aboutContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  link: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0891b2',
    marginBottom: 8,
  },
});