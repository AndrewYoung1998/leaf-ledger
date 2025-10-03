import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type FilterType = 'all' | 'cigar' | 'marijuana' | 'none';

interface FilterProps {
  selected: FilterType;
  onChange: (type: FilterType) => void;
  search: string;
  onSearchChange: (text: string) => void;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Cigar', value: 'cigar' },
  { label: 'Marijuana', value: 'marijuana' },
  { label: 'None', value: 'none' },
];

export default function Filter({ selected, onChange, search, onSearchChange }: FilterProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search entries..."
        value={search}
        onChangeText={onSearchChange}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
      <View style={styles.container}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.button,
              selected === filter.value && styles.selectedButton,
            ]}
            onPress={() => onChange(filter.value)}
          >
            <Text
              style={[
                styles.buttonText,
                selected === filter.value && styles.selectedButtonText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      {/* Sort Button */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            // Cycle through sort options: 'date', 'a-z', 'z-a'
            // We'll use a custom event since Filter is controlled by parent
            // So, we emit a custom event for parent to handle sort change
            if (typeof (onChange as any).sortChange === 'function') {
              (onChange as any).sortChange();
            }
          }}
        >
          
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  sortButtonText: {
    color: '#333',
    fontWeight: '500',
  },
});

export type { FilterType };

