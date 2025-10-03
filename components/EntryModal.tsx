 import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

interface EntryModalProps {
  visible: boolean;
  title: string;
  content: string;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cigar: boolean;
  marijuana: boolean;
  setCigar: (v: boolean) => void;
  setMarijuana: (v: boolean) => void;
}

export default function EntryModal({ visible, title, content, setTitle, setContent, onSubmit, onCancel, submitLabel = 'Save', cigar, marijuana, setCigar, setMarijuana }: EntryModalProps) {
  const [cigarChecked, setCigarChecked] = useState(cigar);
  const [marijuanaChecked, setMarijuanaChecked] = useState(marijuana);
  useEffect(() => {
    setCigarChecked(cigar);
    setMarijuanaChecked(marijuana);
    setCigar(cigar);
    setMarijuana(marijuana);
  }, [cigar, marijuana]);
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Item Name"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Item Information"
            value={content}
            onChangeText={setContent}
            style={styles.input}
            multiline
          />
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
                <Checkbox style={styles.checkbox} value={cigarChecked} onValueChange={() => {
                  setCigarChecked(!cigarChecked);
                  setCigar(!cigarChecked);
                }} />
                <Text>Cigar</Text>
                
            </View>
            <View style={styles.checkboxItem}>
            <Checkbox style={styles.checkbox} value={marijuanaChecked} onValueChange={() => {
              setMarijuanaChecked(!marijuanaChecked);
              setMarijuana(!marijuanaChecked);
            }} />
                <Text>Marijuana</Text>
            </View>
          </View>
          <Button title={submitLabel} onPress={onSubmit} />
          <Button title="Cancel" onPress={onCancel} color="gray" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  checkbox: {
   
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5    
  },
}); 