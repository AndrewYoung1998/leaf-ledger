import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface SwipeableEntryProps {
  item: any;
  onDelete: (id: number) => void;
}

export default function SwipeableEntry({ item, onDelete }: SwipeableEntryProps) {
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.entry_id)}
      >
        <Ionicons name="trash" size={24} color="white" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.entry}>
        <Text style={styles.title}>
          {item && 'title' in item ? (item as any).title : 'No Title'}
        </Text>
        <Text>{item.content}</Text>
        <Text style={styles.date}>{item.entry_date}</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  entry: {
    backgroundColor: '#f9f9f9',
    margin: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '80%',
    marginVertical: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});