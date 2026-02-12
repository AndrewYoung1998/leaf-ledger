import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Consumption {
  edibles: boolean;
  vape: boolean;
  smoke: boolean;
  tincture: boolean;
}

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
  photo_uris: string[];
  setCigar: (v: boolean) => void;
  setMarijuana: (v: boolean) => void;
  setPhotoUris: (v: string[]) => void;
}


export default function EntryModal({ visible, title, content, setTitle, setContent, onSubmit, onCancel, submitLabel = 'Save', cigar, marijuana, photo_uris, setCigar, setMarijuana, setPhotoUris }: EntryModalProps) {
  const [consumption, setConsumption] = useState<Consumption>({
    edibles: false,
    vape: false,
    smoke: false,
    tincture: false
  })
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');

  useEffect(() => {
    // No need to sync photo_uris here since it's controlled by parent
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Add to array instead of replacing
      setPhotoUris([...photo_uris, result.assets[0].uri]);
    }
  };

  const removeImage = (uriToRemove: string) => {
    setPhotoUris(photo_uris.filter(uri => uri !== uriToRemove));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Image Picker / Gallery */}
          {photo_uris.length === 0 ? (
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={32} color="#007bff" />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.galleryContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                {photo_uris.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <TouchableOpacity onPress={() => {
                      setSelectedImageUri(uri);
                      setImageModalVisible(true);
                    }}>
                      <Image source={{ uri }} style={styles.galleryImage} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(uri)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="add-circle" size={36} color="#007bff" />
              </TouchableOpacity>
            </View>
          )}
          {/* Title */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Title"
          />
          {/* Content */}
          <TextInput
            value={content}
            onChangeText={setContent}
            style={styles.input}
            multiline={true}
            placeholder="Content"
          />
          {/* Cigar / Marijuana */}
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <Checkbox style={styles.checkbox} value={cigar} onValueChange={() => {
                setCigar(!cigar);
              }} />
              <Text>Cigar</Text>
              <Checkbox style={styles.checkbox} value={marijuana} onValueChange={() => {
                setMarijuana(!marijuana);
              }} />
              <Text>Marijuana</Text>
            </View>
          </View>
          {/* Consumption Type */}
          {marijuana && (
            <View style={styles.checkboxContainer}>
              <Text>Consumption Type</Text>
              <View style={styles.checkboxItem}>
                <Checkbox style={styles.checkbox} value={consumption.edibles} onValueChange={() => {
                  setConsumption(prev => ({ ...prev, edibles: !prev.edibles }))
                }} />
                <Text>Edibles</Text>
                <Checkbox style={styles.checkbox} value={consumption.vape} onValueChange={() => {
                  setConsumption(prev => ({ ...prev, vape: !prev.vape }))
                }} />
                <Text>Vape</Text>
              </View>
              <View style={styles.checkboxItem}>
                <Checkbox style={styles.checkbox} value={consumption.smoke} onValueChange={() => {
                  setConsumption(prev => ({ ...prev, smoke: !prev.smoke }))
                }} />
                <Text>Smoke</Text>
                <Checkbox style={styles.checkbox} value={consumption.tincture} onValueChange={() => {
                  setConsumption(prev => ({ ...prev, tincture: !prev.tincture }))
                }} />
                <Text>Tincture</Text>
              </View>
            </View>
          )}

          <Button title={submitLabel} onPress={onSubmit} />
          <Button title="Cancel" onPress={onCancel} color="gray" />
        </View>
      </View>

      {/* Image Enlargement Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.imageModalOverlay}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          <Image source={{ uri: selectedImageUri }} style={styles.enlargedImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
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
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 8,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  galleryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 15,
  },
  galleryImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  addImageButton: {
    padding: 8,
  },
  galleryScroll: {
    maxHeight: 170,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedImage: {
    width: '90%',
    height: '80%',
  },
  /* end image stuff */
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
  },
  checkboxContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  checkbox: {
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
}); 