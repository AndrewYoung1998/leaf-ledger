import FAB from '@/components/FAB';
import SwipeableEntry from '@/components/SwipeableEntry';
import { JournalEntry } from '@/interfaces/JournalEntries';
import { useEffect, useState } from 'react';
import { Button, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import db, { addJournalEntry } from '../../hooks/useDatabase';

export default function HomeScreen() {
  const [journalEntries, setEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryId, setEntryId] = useState<number | null>(null);
  // Fetch entries on mount and after adding
  const fetchEntries = async () => {
    const data = await db.getJournalEntries();
    setEntries(data);
  };
  // Add entry
  const handleAdd = async () => {
    await addJournalEntry({
      title,
      content,
      entry_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setModalVisible(false);
    setTitle('');
    setContent('');
    const entries = await db.getJournalEntries();
    setEntries(entries);
    fetchEntries();
  };
  const handleDelete = async (entry_id: number) => {
    await db.deleteJournalEntry(entry_id);
    const entries = await db.getJournalEntries();
    setEntries(entries);
  };
  // Edit entry
  const handleEdit = async (entry_id: number) => {
    setEntryId(entry_id);
    setModalVisible(true);
    setTitle(journalEntries.find(entry => entry.entry_id === entry_id)?.title ?? '');
    setContent(journalEntries.find(entry => entry.entry_id === entry_id)?.content ?? '');
  };
  // Save edit
  const handleSaveEdit = async () => {
    if (entryId) {
      await db.editJournalEntry(entryId, title, content);
      setModalVisible(false); // Hide modal after saving
      setEntryId(null); // Reset entryId
      setTitle('');
      setContent('');
      fetchEntries();
    }
  };
  useEffect(() => {
    (async () => {
      await db.initializeDatabase();
      fetchEntries();
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={journalEntries}
          keyExtractor={item => item.entry_id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <SwipeableEntry item={item} onDelete={handleDelete} onEdit={handleEdit} />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No entries yet.</Text>
          }
        />

        <FAB onPress={() => setModalVisible(true)} />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TextInput
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                style={styles.input}
                multiline
              />
            <Button 
              title={entryId ? "Save Edit" : "Add Entry"} 
              onPress={entryId ? handleSaveEdit : handleAdd} 
            />
            <Button 
              title="Cancel" 
              onPress={() => {
                setModalVisible(false);
                setEntryId(null);
                setTitle('');
                setContent('');
              }} 
              color="gray" 
            />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
  },
});
