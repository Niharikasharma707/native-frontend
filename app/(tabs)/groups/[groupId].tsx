// app/(tabs)/GroupDetailScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteGroup, leaveGroup, getGroupDetails } from '@/app/api/Group';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';


const GroupDetailScreen = () => {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Fetch group details
  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroupDetails(groupId as string),
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      router.back();
      Alert.alert('Success', 'Group deleted successfully');
    },
  });

  // Leave group mutation
  const leaveGroupMutation = useMutation({
    mutationFn: (groupId: string) => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      router.back();
      Alert.alert('Success', 'Left group successfully');
    },
  });

  const handleDeleteGroup = () => {
    deleteGroupMutation.mutate(groupId as string);
  };

  const handleLeaveGroup = () => {
    leaveGroupMutation.mutate(groupId as string);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{group?.name}</Text>
        <TouchableOpacity onPress={() =>{
    console.log("Menu opened");
    setIsMenuVisible(true);
  }}>
 <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
         </TouchableOpacity>
      </View>

      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                // Implement invite logic here
              }}
            >
              <Text style={styles.menuItemText}>Invite Members</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                handleLeaveGroup();
              }}
            >
              <Text style={styles.menuItemText}>Leave Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                handleDeleteGroup();
              }}
            >
              <Text style={styles.menuItemText}>Delete Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setIsMenuVisible(false)}
            >
              <Text style={styles.menuItemText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GroupDetailScreen;