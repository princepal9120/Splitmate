import { useState } from 'react';
import { View, StyleSheet, Image,Text, TextInput, Button } from 'react-native';

import { Link } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error } = useAuthStore();

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