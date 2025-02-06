import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import Auth0 from "react-native-auth0";

// Define the type for navigation
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;
type LoginScreenRouteProp = RouteProp<RootStackParamList, "Login">;

interface Props {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

// Initialize Auth0 with credentials
const auth0 = new Auth0({
  domain: "dev-g8rnkaaa0ma7scup.us.auth0.com", // Replace with your Auth0 domain
  clientId: "aIbQXlEI5lHPz6onv3sck5qNFdLLtFBB", // Replace with your Client ID
});

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const credentials = await auth0.webAuth.authorize({
        scope: "openid profile email",
        audience: "https://dev-g8rnkaaa0ma7scup.us.auth0.com/api/v2/",
      });

      console.log("Logged in successfully:", credentials);
      setLoading(false);

      // Navigate to Home screen after successful login
      navigation.replace("Home");
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Auth0 Login</Text>
      
      <TouchableOpacity style={styles.button} onPress={login} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login with Auth0</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
