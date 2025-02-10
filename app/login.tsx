import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Alert, 
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { supabase } from '../supabase';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
  
    if (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
      return;
    }
  
    const token = data.session?.access_token;
    if (!token) {
      setLoading(false);
      Alert.alert('Error', 'No access token received');
      return;
    }
  
    const response = await fetch('http://localhost:3000/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    const backendData = await response.json();
    setLoading(false);
  
    if (backendData.error) {
      Alert.alert('Error', backendData.error);
    } else {
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/home');
    }
  };
  

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else {
      Alert.alert(
        'Success', 
        'Please check your email for verification!',
        [{ text: 'OK', onPress: () => setIsLogin(true) }]
      );
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Sign in to continue' 
                : 'Sign up to get started'
              }
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
            )}

            <TouchableOpacity 
              style={styles.button}
              onPress={isLogin ? handleLogin : handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
              }}
            >
              <Text style={styles.switchButtonText}>
                {isLogin 
                  ? "Don't have an account? Sign Up" 
                  : "Already have an account? Login"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#0284c7',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 10,
    padding: 10,
  },
  switchButtonText: {
    color: '#0284c7',
    textAlign: 'center',
    fontSize: 16,
  }
});