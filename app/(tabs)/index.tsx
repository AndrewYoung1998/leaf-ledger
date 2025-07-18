import FAB from '@/components/FAB';
import { useEffect, useState } from 'react';
import { Button, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import db, { addJournalEntry } from '../../hooks/useDatabase';

export default function HomeScreen() {
  const [journalEntries, setEntries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // Fetch entries on mount and after adding
  const fetchEntries = async () => {
    const data = await db.getJournalEntries();
    setEntries(data);
    console.log(data);
  };
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
    // Optionally refresh your data here
  };
  
  useEffect(() => {
    (async () => {
      await db.initializeDatabase();
      fetchEntries();
      console.log(journalEntries);
    })();
  }, [journalEntries]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Journal Entries</Text>
        <FlatList
          data={journalEntries}
          keyExtractor={(item, index) => (item && 'entry_id' in item ? String((item as any).entry_id) : String(index))}
          renderItem={({ item }) => (
            <Text>{item && 'title' in item ? (item as any).title : 'No Title'}</Text>
          )}
        />
        <FAB onPress={() => setModalVisible(true)}  />

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
            <Button title="Add Entry" onPress={handleAdd} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
