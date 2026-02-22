import EntryModal from '@/components/EntryModal';
import FAB from '@/components/FAB';
import Filter, { FilterType, SortType } from '@/components/Filter';
import { SwipeableEntry } from '@/components/SwipeableEntry';
import { Palette } from '@/constants/Colors';
import { JournalEntry } from '@/interfaces/JournalEntries';
import * as Location from 'expo-location';

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [sortBy, setSortBy] = useState<SortType>('date');
  //const [consumptionType, setConsumption] = useState<ProductConsumption[]>([]);
  // Fetch entries on mount and after adding
  const [locationData, setLocationData] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
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
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        // Sort by date (newest first)
        return new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime();
      } else if (sortBy === 'name-asc') {
        // Sort by name A-Z
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      } else if (sortBy === 'name-desc') {
        // Sort by name Z-A
        return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
      }
      return 0;
    });
    
    setEntries(sorted);
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
  const handleDelete = (entry_id: number) => {
    setPendingDeleteId(entry_id);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    await db.deleteJournalEntry(pendingDeleteId);
    const entries = await db.getJournalEntries();
    setEntries(entries);
    setPendingDeleteId(null);
    setDeleteConfirmVisible(false);
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
  // Run once on mount: init DB and load entries
  useEffect(() => {
    (async () => {
      await db.initializeDatabase();
      await fetchEntries();
    })();
  }, [selectedFilter, search, sortBy]);

  // Run once on mount: fetch region on initial app load
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const msg = 'Permission to access location was denied';
        setErrorMsg(msg);
        Alert.alert('Error', msg, [{ text: 'OK' }]);
        return;
      }
      try {
        let positions = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        let stateInfo = await Location.reverseGeocodeAsync(positions.coords);
        const regionInfo = stateInfo[0]?.region ?? null;
        setLocationData(regionInfo);
        console.log('Region on load:', regionInfo);
      } catch (e) {
        const msg = 'Could not get location';
        setErrorMsg(msg);
        Alert.alert('Error', msg, [{ text: 'OK' }]);
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Filter 
          selected={selectedFilter} 
          onChange={setSelectedFilter} 
          search={search} 
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
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
          submitLabel={entryId ? 'Save' : 'Add Entry'}
          cigar={cigar}
          marijuana={marijuana}
          photo_uris={photo_uris}
          setCigar={setCigar}
          setMarijuana={setMarijuana}
          setPhotoUris={setPhotoUris}
        />

        <Modal
          visible={deleteConfirmVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setDeleteConfirmVisible(false)}
        >
          <TouchableOpacity
            style={styles.deleteModalOverlay}
            activeOpacity={1}
            onPress={() => setDeleteConfirmVisible(false)}
          >
            <View style={styles.deleteModalContent}>
              <View style={styles.deleteModalIconWrap}>
                <Ionicons name="trash-outline" size={32} color="#e53935" />
              </View>
              <Text style={styles.deleteModalTitle}>Delete Entry</Text>
              <Text style={styles.deleteModalMessage}>
                Are you sure you want to delete this entry? This cannot be undone.
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={styles.deleteModalCancelBtn}
                  onPress={() => {
                    setPendingDeleteId(null);
                    setDeleteConfirmVisible(false);
                  }}
                >
                  <Text style={styles.deleteModalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteModalDeleteBtn} onPress={confirmDelete}>
                  <Ionicons name="trash" size={18} color="white" />
                  <Text style={styles.deleteModalDeleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
    backgroundColor: Palette.cloudWhite,
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: Palette.border,
    marginBottom: 12,
    padding: 8,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    width: '85%',
    backgroundColor: Palette.cloudWhite,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
  },
  deleteModalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229,57,53,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.sageShadow,
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: 15,
    color: Palette.sageShadowLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  deleteModalCancelBtn: {
    flex: 1,
    backgroundColor: Palette.cloudWhite,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalCancelBtnText: {
    color: Palette.sageShadow,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalDeleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e53935',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteModalDeleteBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
