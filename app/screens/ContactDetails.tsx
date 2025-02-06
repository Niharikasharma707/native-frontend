import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  ContactDetails: { contact: { displayName: string; phoneNumbers: { number: string }[] } };
};

type ContactDetailsRouteProp = RouteProp<RootStackParamList, "ContactDetails">;
type ContactDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, "ContactDetails">;

interface Props {
  route: ContactDetailsRouteProp;
  navigation: ContactDetailsNavigationProp;
}

const ContactDetails: React.FC<Props> = ({ route }) => {
  const { contact } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{contact.displayName}</Text>
      {contact.phoneNumbers.map((phone, index) => (
        <Text key={index} style={styles.phone}>{phone.number}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  phone: {
    fontSize: 18,
  },
});

export default ContactDetails;
