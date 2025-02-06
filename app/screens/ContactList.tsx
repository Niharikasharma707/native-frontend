import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as Contacts from 'expo-contacts';
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../api/AuthUsers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: { number: string }[];
}

type RootStackParamList = {
  ContactList: undefined;
  ContactDetails: { contact: Contact };
};

const ContactList: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState<boolean>(true);

  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: AuthService.fetchUsers,
  });

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { status } = await Contacts.requestPermissionsAsync();
        
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
          });

          if (data.length > 0) {
            const transformedContacts: Contact[] = data
            .filter(contact => contact.id) // Ensure id exists
            .map(contact => ({
              id: contact.id ?? "", // Ensure id is always a string
              name: contact.name || "No Name",
              phoneNumbers: contact.phoneNumbers
                ?.filter(phone => phone.number) // Ensure number exists
                .map(phone => ({
                  number: phone.number ?? "", // Ensure number is always a string
                })) || [],
            }));
          
          
            setContacts(transformedContacts);
          }
          
        } else {
          console.warn('Contacts permission denied');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoadingContacts(false);
      }
    };

    getContacts();
  }, []);

  if (loadingContacts || isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error loading registered users</Text>
      </View>
    );
  }

  const registeredPhones = usersData || [];

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const isRegistered = item.phoneNumbers?.some((phone) =>
          registeredPhones.includes(phone.number)
        ) || false;

        return (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("ContactDetails", { contact: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={isRegistered ? styles.registered : styles.notRegistered}>
              {isRegistered ? "Already Registered" : "Not Registered"}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontWeight: "bold",
  },
  registered: {
    color: "green",
  },
  notRegistered: {
    color: "red",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ContactList;