import { Palette } from '@/constants/Colors';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import {getJournalEntries} from "@/hooks/database/useDatabase";
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

function formatJson(data: any[]): string {
    return JSON.stringify(data, null, 2); // Pretty print with 2 spaces
}

function formatCsv(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')]; // Add header row

    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            // Handle potential commas or quotes within values by enclosing them in quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

async function exportAndShare(format: 'csv' | 'json') {
    const data = await getJournalEntries();
    if (data.length === 0) {
        alert('No data to export.');
        return;
    }

    let fileContent: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
        fileContent = formatJson(data);
        filename = `leaf_ledger_journal_entries_export.json`;
        mimeType = 'application/json';
    } else {
        fileContent = formatCsv(data);
        filename = `leaf_ledger_journal_entries_export.csv`;
        mimeType = 'text/csv';
    }

    const file = new File(Paths.cache, filename);

    try {
        file.create();
        file.write(fileContent, {
            encoding: 'utf8'
        });

        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(file.uri, {mimeType});
        } else {
            alert('Sharing is not available on this platform.');
        }
    } catch (error) {
        console.error('Error exporting or sharing file:', error);
    }
}

export default function BackupScreen() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Backup Journal Entries</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => exportAndShare("csv")}>
                            <Text style={styles.cancelButtonText}>Export as CSV</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={() => exportAndShare("json")}>
                            <Text style={styles.submitButtonText}>Export as JSON</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Palette.sageShadow,
    },
    titleContainer: {
        flexDirection: 'row',
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
