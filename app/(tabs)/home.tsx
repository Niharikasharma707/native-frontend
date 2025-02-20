import { View, Text, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../supabase";
import { useMutation } from "@tanstack/react-query";
import { logoutFromBackend } from "../api/Auth";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        await clearSessionData();
        router.replace("/login");
      }
    };

    checkSession();
  }, []);

  const clearSessionData = async () => {
    try {
      await AsyncStorage.multiRemove([
        "supabase-auth-token",
        "user-session",
        "access-token",
      ]);
    } catch (error) {
      console.warn("Error clearing session data:", error);
    }
  };

  const mutation = useMutation({
    mutationFn: logoutFromBackend,
    onSuccess: async () => {
      await clearSessionData();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/login");
    },
    onError: (error: unknown) => {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Home!</Text>
      <Button title="Logout" onPress={() => mutation.mutate()} />
      <Button title="My Groups" onPress={() => router.push("/groups")} />
    </View>
  );
}
