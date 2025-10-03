import EntryModal from '@/components/EntryModal';
import FAB from '@/components/FAB';
import Filter, { FilterType } from '@/components/Filter';
import { SwipeableEntry } from '@/components/SwipeableEntry';
import { JournalEntry } from '@/interfaces/JournalEntries';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import db, { addJournalEntry } from '../../hooks/useDatabase';
export default function HomeScreen() {
  const [journalEntries, setEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryId, setEntryId] = useState<number | null>(null);
  const [cigar, setCigar] = useState(false);
  const [marijuana, setMarijuana] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  // Fetch entries on mount and after adding
  const fetchEntries = async () => {
    const data = await db.getJournalEntries();
    const filtered = data.filter(entry => {
      // Apply search filter first
      if (search.length > 0) {
        const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase()) || 
                             entry.content.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;
      }
      // Apply category filter
      if (selectedFilter === 'cigar') {
        return entry.cigar;
      }
      if (selectedFilter === 'marijuana') {
        return entry.marijuana;
      }
      if (selectedFilter === 'none') {
        return !entry.cigar && !entry.marijuana;
      }
      return true;
    });
    setEntries(filtered);
  };
  // Add entry
  const handleAdd = async () => {
    await addJournalEntry({
      title,
      content,
      entry_date: new Date().toISOString(),
      cigar: cigar,
      marijuana: marijuana,
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
      await db.editJournalEntry(entryId, title, content, cigar, marijuana);
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
  }, [selectedFilter, search]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Filter selected={selectedFilter} onChange={setSelectedFilter} search={search} onSearchChange={setSearch} />
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

        <EntryModal
          visible={modalVisible}
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
          onSubmit={entryId ? handleSaveEdit : handleAdd}
          onCancel={() => {
            setModalVisible(false);
            setEntryId(null);
            setTitle('');
            setContent('');
          }}
          submitLabel={entryId ? 'Save Edit' : 'Add Entry'}
          cigar={cigar}
          marijuana={marijuana}
          setCigar={setCigar}
          setMarijuana={setMarijuana}

        />
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
