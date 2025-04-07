import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import your Firebase auth instance

// Register for redirect URL
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const { signUp, loading, error, setUser } = useAuthStore();

  // Set up Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
   
    webClientId: process.env.EXPO_PUBLIC_WEB2_CLIENT_ID!,
    androidClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  });

  // Handle Google sign-in response
  useEffect(() => {
    if (response?.type === 'success') {
      setGoogleSubmitting(true);
      const { id_token:any } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          // User signed in
          const user = result.user;
          // Update your auth store
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email,
            photoURL: user.photoURL,
          });
        })
        .catch((error) => {
          console.error('Firebase Google Auth Error:', error);
          alert('Google sign in failed. Please try again.');
        })
        .finally(() => {
          setGoogleSubmitting(false);
        });
    }
  }, [response]);

  // Handle regular email/password signup
  const handleSignUp = async () => {
    if (!name.trim()) return alert('Please enter your name');
    await signUp(email, password, name);
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google Sign In Error:', error);
      alert('Failed to initialize Google sign in');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400',
          }}
          style={styles.logo}
        />
        <Text variant="headlineLarge" style={styles.title}>
          Create Account
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign up to get started
        </Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Sign Up
      </Button>

      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <Divider style={styles.divider} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={!request || googleSubmitting}
      >
        <Ionicons
          name="logo-google"
          size={24}
          color="#4285F4"
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>
          {googleSubmitting ? 'Signing in...' : 'Sign up with Google'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text variant="bodyMedium">Already have an account? </Text>
        <Link href="/auth/sign-in" asChild>
          <Button mode="text" compact>
            Sign In
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginVertical: 48,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  error: {
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
});
