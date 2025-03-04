// app/(tabs)/groups.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup, getUserGroups, leaveGroup, deleteGroup } from '../api/Group';
import { useRouter } from 'expo-router';


interface GroupItem {
    id: string;
    name: string;
    owner_id: string;
    members: { user: { id: string } }[];
  }

export default function GroupsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const queryClient = useQueryClient();

  const router = useRouter();

//   Fetch groups
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: getUserGroups,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (name: string) => createGroup(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsModalVisible(false);
      setNewGroupName('');
      Alert.alert('Success', 'Group created successfully!');
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create group');
    }
  });


  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    createGroupMutation.mutate(newGroupName);
  };

  // const handleGroupAction = (groupId: string, isOwner: boolean) => {
  //   Alert.alert(
  //     'Group Action',
  //     'What would you like to do?',
  //     [
  //       {
  //         text: isOwner ? 'Delete Group' : 'Leave Group',
  //         style: 'destructive',
  //         onPress: () => {
  //           if (isOwner) {
  //             deleteGroupMutation.mutate(groupId);
  //           } else {
  //             leaveGroupMutation.mutate(groupId);
  //           }
  //         }
  //       },
  //       { text: 'Cancel', style: 'cancel' }
  //     ]
  //   );
  // };

  const renderGroup = ({ item }: { item: GroupItem }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => router.push(`/groups/${item.id}`)}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.memberCount}>
        {item.members?.length || 0} member{item.members?.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.title}>My Groups</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No groups yet. Create one to get started!</Text>
        }
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewGroupName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateGroup}
                disabled={createGroupMutation.isPending}
              >
                <Text style={styles.createButtonText}>
                  {createGroupMutation.isPending ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  createButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  listContainer: {
    paddingHorizontal: 20
  },
  groupCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  memberCount: {
    fontSize: 14,
    color: '#666'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 16,
    color: '#333'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600'
  },
  createModalButton: {
    backgroundColor: '#0284c7'
  }
});