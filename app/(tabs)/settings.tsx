import { Palette } from '@/constants/Colors';
import { exportAndShare } from '@/utils/exportJournal';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
// Settings screen
// - Journal
// - Data & Storage
// - About

// - SettingBlock is a component that displays a title and a list of settings
// - SettingRow is a component that displays a row of settings
// - SettingToggle is a component that displays a toggle switch
// - SettingRow and SettingToggle are used to display the settings in the settings screen
// - SettingBlock is used to display the settings in the settings screen
// - SettingRow and SettingToggle are used to display the settings in the settings screen
function SettingBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={Palette.cedarwood} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {showChevron && onPress ? (
          <Ionicons name="chevron-forward" size={20} color={Palette.sageShadowLight} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function SettingToggle({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={[styles.row, styles.rowNoTouch]}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={Palette.cedarwood} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Palette.border, true: Palette.eucalyptus }}
        thumbColor="#fff"
      />
    </View>
  );
}

//SettingsScreen is the main screen that displays the settings

export default function SettingsScreen() {
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    const success = await exportAndShare(format);
    if (success) setExportModalVisible(false);
  };

  return (
    <GestureHandlerRootView style={styles.screen}>
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <SettingBlock title="Journal">
            <SettingRow
              icon="calendar-outline"
              label="Default sort order"
              value="Date (newest)"
              onPress={() => {}}
            />
            <SettingRow icon="filter-outline" label="Default filter" value="All" onPress={() => {}} />
          </SettingBlock>


          <SettingBlock title="Data & Storage">
            <SettingRow
              icon="cloud-download-outline"
              label="Export journal"
              onPress={() => setExportModalVisible(true)}
            />
            {/* <SettingRow icon="trash-outline" label="Clear cache" onPress={() => { }} /> */}
          </SettingBlock>

          <SettingBlock title="About">
            <SettingRow icon="information-circle-outline" label="Version" value="1.0.0" showChevron={false} />
            <SettingRow icon="document-text-outline" label="Privacy policy" onPress={() => {}} />
            <SettingRow icon="help-circle-outline" label="Help & support" onPress={() => {}} />
          </SettingBlock>
        </ScrollView>

        {/* Export Modal */}
        <Modal
          visible={exportModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setExportModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setExportModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Export Journal</Text>
              <Text style={styles.modalSubtitle}>
                Choose a format to export and share your entries.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  onPress={() => handleExport('csv')}
                >
                  <Ionicons name="document-text-outline" size={22} color={Palette.cedarwood} />
                  <Text style={styles.modalSecondaryBtnText}>Export as CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => handleExport('json')}
                >
                  <Ionicons name="code-slash-outline" size={22} color="white" />
                  <Text style={styles.modalPrimaryBtnText}>Export as JSON</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setExportModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
    marginVertical: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Palette.sageShadow,
    marginBottom: 24,
  },
  block: {
    marginBottom: 24,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.sageShadowLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.cloudWhite,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 8,
  },
  rowNoTouch: {
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Palette.sageShadow,
  },
  rowValue: {
    fontSize: 14,
    color: Palette.sageShadowLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Palette.cloudWhite,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.sageShadow,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: Palette.sageShadowLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  modalSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  modalSecondaryBtnText: {
    color: Palette.sageShadow,
    fontSize: 16,
    fontWeight: '600',
  },
  modalPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Palette.cedarwood,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalPrimaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCancelBtnText: {
    fontSize: 16,
    color: Palette.sageShadowLight,
    fontWeight: '600',
  },
});
