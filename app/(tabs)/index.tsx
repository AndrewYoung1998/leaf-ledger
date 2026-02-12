import EntryModal from '@/components/EntryModal';
import FAB from '@/components/FAB';
import Filter, { FilterType } from '@/components/Filter';
import { SwipeableEntry } from '@/components/SwipeableEntry';
import { JournalEntry } from '@/interfaces/JournalEntries';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import db, { addJournalEntry } from '../../hooks/database/useDatabase';
export default function HomeScreen() {
  const [journalEntries, setEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryId, setEntryId] = useState<number | null>(null);
  const [cigar, setCigar] = useState(false);
  const [marijuana, setMarijuana] = useState(false);
  const [photo_uris, setPhotoUris] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  //const [consumptionType, setConsumption] = useState<ProductConsumption[]>([]);
  // Fetch entries on mount and after adding

  const resetEntryUseStates = () => {
    setTitle('');
    setContent('');
    setCigar(false);
    setMarijuana(false);
    setPhotoUris([]);
  }

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
      photo_uris: photo_uris,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    const entries = await db.getJournalEntries();
    // Get the latest entry (assuming newest by created_at or max entry_id)
    const latestEntry = entries.reduce((prev, current) => {
      return (prev.entry_id > current.entry_id) ? prev : current;
    }, entries[0]);
    const latestEntryId = latestEntry ? latestEntry.entry_id : null;
    await db.addProductConsumption({
      consumption_type: null, // This should be defined in your state
      quantity: null,
      unit: null,
      details: null,
      consumption_time: new Date().toISOString(),
      entry_id: latestEntryId
    });
    setModalVisible(false);
    resetEntryUseStates();
    setEntries(entries);
    await fetchEntries();
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
    setCigar(journalEntries.find(entry => entry.entry_id === entry_id)?.cigar ?? false);
    setMarijuana(journalEntries.find(entry => entry.entry_id === entry_id)?.marijuana ?? false);
    setPhotoUris(journalEntries.find(entry => entry.entry_id === entry_id)?.photo_uris ?? []);
  };
  // Save edit
  const handleSaveEdit = async () => {
    if (entryId) {
      await db.editJournalEntry(entryId, title, content, cigar, marijuana, photo_uris);
      setModalVisible(false); // Hide modal after saving
      setEntryId(null); // Reset entryId
      resetEntryUseStates();
      await fetchEntries();
    }
  };
  useEffect(() => {
    (async () => {
      await db.initializeDatabase();
      await fetchEntries();
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
            resetEntryUseStates();
          }}
          submitLabel={entryId ? 'Save Edit' : 'Add Entry'}
          cigar={cigar}
          marijuana={marijuana}
          photo_uris={photo_uris}
          setCigar={setCigar}
          setMarijuana={setMarijuana}
          setPhotoUris={setPhotoUris}
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
