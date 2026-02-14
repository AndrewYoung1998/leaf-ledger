import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type FilterType = 'all' | 'cigar' | 'marijuana' | 'none';
type SortType = 'date' | 'name-asc' | 'name-desc';

interface FilterProps {
  selected: FilterType;
  onChange: (type: FilterType) => void;
  search: string;
  onSearchChange: (text: string) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Cigar', value: 'cigar' },
  { label: 'Marijuana', value: 'marijuana' },
  { label: 'None', value: 'none' },
];

const SORT_OPTIONS: { label: string; value: SortType; icon: string }[] = [
  { label: 'Date (Newest First)', value: 'date', icon: 'calendar-outline' },
  { label: 'Name (A-Z)', value: 'name-asc', icon: 'arrow-up-outline' },
  { label: 'Name (Z-A)', value: 'name-desc', icon: 'arrow-down-outline' },
];

export default function Filter({ selected, onChange, search, onSearchChange, sortBy, onSortChange }: FilterProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleFilterSelect = (type: FilterType) => {
    onChange(type);
    setModalVisible(false);
  };

  const handleSortSelect = (sort: SortType) => {
    onSortChange(sort);
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search entries..."
          value={search}
          onChangeText={onSearchChange}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <TouchableOpacity 
          style={styles.filterIconButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            
            {/* Filter Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filter by Type</Text>
              <View style={styles.filterList}>
                {FILTERS.map(filter => (
                  <TouchableOpacity
                    key={filter.value}
                    style={[
                      styles.filterOption,
                      selected === filter.value && styles.selectedFilterOption,
                    ]}
                    onPress={() => handleFilterSelect(filter.value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selected === filter.value && styles.selectedFilterOptionText,
                      ]}
                    >
                      {filter.label}
                    </Text>
                    {selected === filter.value && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort by</Text>
              <View style={styles.filterList}>
                {SORT_OPTIONS.map(sort => (
                  <TouchableOpacity
                    key={sort.value}
                    style={[
                      styles.filterOption,
                      sortBy === sort.value && styles.selectedFilterOption,
                    ]}
                    onPress={() => handleSortSelect(sort.value)}
                  >
                    <View style={styles.sortOptionContent}>
                      <Ionicons 
                        name={sort.icon as any} 
                        size={18} 
                        color={sortBy === sort.value ? '#007bff' : '#666'} 
                      />
                      <Text
                        style={[
                          styles.filterOptionText,
                          sortBy === sort.value && styles.selectedFilterOptionText,
                        ]}
                      >
                        {sort.label}
                      </Text>
                    </View>
                    {sortBy === sort.value && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  filterIconButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 44,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterList: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFilterOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007bff',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: '#007bff',
    fontWeight: '600',
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export type { FilterType, SortType };

