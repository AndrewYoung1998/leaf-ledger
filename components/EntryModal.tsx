import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/Colors';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
        <Text style={styles.inputLabel}>Gallery</Text>
          {/* Image Picker / Gallery */}
          {photo_uris.length === 0 ? (
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={32} color={Palette.cedarwood} />
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
                <Ionicons name="add-circle" size={36} color={Palette.cedarwood} />
              </TouchableOpacity>
            </View>
          )}
          {/* Title */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              placeholder="Enter title..."
              placeholderTextColor="#999"
            />
          </View>

          {/* Content */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              style={styles.contentInput}
              multiline={true}
              placeholder="Write your thoughts..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </View>
          {/* Cigar / Marijuana */}
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <View style={styles.checkboxWrapper}>
                <Checkbox style={styles.checkbox} value={cigar} onValueChange={() => {
                  setCigar(!cigar);
                  if (!cigar) setMarijuana(false); // Deselect marijuana when selecting cigar
                }} />
                <Text>Cigar</Text>
              </View>
              <View style={styles.checkboxWrapper}>
                <Checkbox style={styles.checkbox} value={marijuana} onValueChange={() => {
                  setMarijuana(!marijuana);
                  if (!marijuana) setCigar(false); // Deselect cigar when selecting marijuana
                }} />
                <Text>Marijuana</Text>
              </View>
            </View>
          </View>
          {/* Consumption Type */}
          {marijuana && (
            <View style={styles.consumptionContainer}>
              <Text style={styles.consumptionTitle}>Consumption Type</Text>
              <View style={styles.consumptionGrid}>
                <View style={styles.consumptionRow}>
                  <View style={styles.consumptionItem}>
                    <Checkbox style={styles.checkbox} value={consumption.edibles} onValueChange={() => {
                      setConsumption(prev => ({ ...prev, edibles: !prev.edibles }))
                    }} />
                    <Text style={styles.consumptionLabel}>Edibles</Text>
                  </View>
                  <View style={styles.consumptionItem}>
                    <Checkbox style={styles.checkbox} value={consumption.vape} onValueChange={() => {
                      setConsumption(prev => ({ ...prev, vape: !prev.vape }))
                    }} />
                    <Text style={styles.consumptionLabel}>Vape</Text>
                  </View>
                </View>
                <View style={styles.consumptionRow}>
                  <View style={styles.consumptionItem}>
                    <Checkbox style={styles.checkbox} value={consumption.smoke} onValueChange={() => {
                      setConsumption(prev => ({ ...prev, smoke: !prev.smoke }))
                    }} />
                    <Text style={styles.consumptionLabel}>Smoke</Text>
                  </View>
                  <View style={styles.consumptionItem}>
                    <Checkbox style={styles.checkbox} value={consumption.tincture} onValueChange={() => {
                      setConsumption(prev => ({ ...prev, tincture: !prev.tincture }))
                    }} />
                    <Text style={styles.consumptionLabel}>Tincture</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: Palette.cloudWhite,
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
    borderColor: Palette.cedarwood,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    color: Palette.cedarwood,
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
    borderColor: Palette.cedarwood,
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
    backgroundColor: Palette.cloudWhite,
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

  /* Input Styles */
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.sageShadow,
    marginBottom: 6,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Palette.cloudWhite,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: Palette.cloudWhite,
    minHeight: 100,
  },

  /* Consumption Type Styles */
  consumptionContainer: {
    marginBottom: 16,
    backgroundColor: Palette.cloudWhite,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  consumptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.sageShadow,
    marginBottom: 12,
    textAlign: 'center',
  },
  consumptionGrid: {
    gap: 8,
  },
  consumptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  consumptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  consumptionLabel: {
    fontSize: 14,
    color: Palette.sageShadowLight,
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
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  /* Button Styles */
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Palette.cloudWhite,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cancelButtonText: {
    color: Palette.sageShadowLight,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: Palette.cedarwood,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 