import { Palette } from '@/constants/Colors';
import { exportAndShare } from '@/utils/exportJournal';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BackupScreen() {
    return (
        <GestureHandlerRootView style={styles.screen}>
            <SafeAreaView style={styles.screen} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <View style={styles.iconWrap}>
                            <Ionicons name="cloud-download-outline" size={48} color={Palette.cedarwood} />
                        </View>
                        <Text style={styles.title}>Backup Journal Entries</Text>
                        <Text style={styles.subtitle}>
                            Export your journal as CSV or JSON to save or share your entries.
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={() => exportAndShare('csv')}>
                                <Ionicons name="document-text-outline" size={22} color={Palette.cedarwood} />
                                <Text style={styles.secondaryButtonText}>Export as CSV</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.primaryButton} onPress={() => exportAndShare('json')}>
                                <Ionicons name="code-slash-outline" size={22} color="white" />
                                <Text style={styles.primaryButtonText}>Export as JSON</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 24,
    },
    card: {
        backgroundColor: Palette.cloudWhite,
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        borderColor: Palette.border,
        alignItems: 'center',
    },
    iconWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Palette.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Palette.sageShadow,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: Palette.sageShadowLight,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    secondaryButton: {
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
    secondaryButtonText: {
        color: Palette.sageShadow,
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Palette.cedarwood,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
