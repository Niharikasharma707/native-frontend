import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContactList from './screens/ContactList';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ContactList">
          <Stack.Screen 
            name="ContactList" 
            component={ContactList}
            options={{ title: 'Contacts' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}