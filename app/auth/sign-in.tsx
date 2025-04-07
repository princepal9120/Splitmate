import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper'; 
import { Link } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Register for redirect URL
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, loading, error, setUser } = useAuthStore();

  // Set up Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB2_CLIENT_ID, // Get this from Google Cloud Console
    androidClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  });

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success') {
      setGoogleLoading(true);
      handleGoogleResponse(response.authentication);
    }
  }, [response]);

  const handleGoogleResponse = async (authentication: any) => {
    try {
      // Create Firebase credential with Google token
      const { id_token } = authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      
      // Sign in with credential to Firebase
      const result = await signInWithCredential(auth, credential);
      const user = result.user;
      
      // Update your auth store with user info
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || null,
      });
    } catch (error: any) {
      console.error("Firebase Google Auth Error:", error);
      alert("Google sign in failed: " + (error.message || "Unknown error"));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignIn = async () => {
    await signIn(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400' }}
          style={styles.logo}
        />
        <Text variant="headlineLarge" style={styles.title}>Welcome Back</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Sign in to continue</Text>
      </View>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

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
        onPress={handleSignIn}
        loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Sign In
      </Button>

      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <Divider style={styles.divider} />
      </View>

      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={() => promptAsync()}
        disabled={!request || googleLoading || loading}
      >
        <Ionicons name="logo-google" size={24} color="#4285F4" style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text variant="bodyMedium">Don't have an account? </Text>
        <Link href="/auth/sign-up" asChild>
          <Button mode="text" compact>Sign Up</Button>
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
    marginBottom: 16,
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
    marginTop: 24,
  },
  error: {
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
});