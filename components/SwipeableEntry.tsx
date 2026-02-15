import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface SwipeableEntryProps {
  item: any;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export function SwipeableEntry({ item, onDelete, onEdit }: SwipeableEntryProps) {
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
  const renderLeftActions = () => {
    return (
      <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item.entry_id)}>
        <Ionicons name="pencil" size={24} color="white" />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <View style={styles.entry}>
        <Text style={styles.title}>
          {item && 'title' in item ? (item as any).title : 'No Name'}
        </Text>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.type}>{item.cigar ? 'Cigar' : item.marijuana ? 'Marijuana' : 'None'}</Text>
          <Text style={styles.date}>
            {item.entry_date
              ? new Date(item.entry_date).toLocaleDateString()
              : ''}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  entry: {
    backgroundColor: Palette.cloudWhite,
    margin: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: Palette.sageShadow,
  },
  content: {
    fontSize: 14,
    color: Palette.sageShadow,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  type: {
    fontSize: 12,
    color: Palette.sageShadowLight,
  },
  date: {
    fontSize: 12,
    color: Palette.sageShadowLight,
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
  editButton: {
    backgroundColor: Palette.cedarwood,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '80%',
    marginVertical: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
  editText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  }
});