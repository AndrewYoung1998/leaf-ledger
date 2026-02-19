import { getJournalEntries } from '@/hooks/database/useDatabase';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function formatJson(data: any[]): string {
  return JSON.stringify(data, null, 2);
}

function formatCsv(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export async function exportAndShare(format: 'csv' | 'json') {
  const data = await getJournalEntries();
  if (data.length === 0) {
    alert('No data to export.');
    return false;
  }

  const now = new Date();
  let fileContent: string;
  let filename: string;
  let mimeType: string;

  if (format === 'json') {
    fileContent = formatJson(data);
    filename = `leaf_ledger_journal_entries_export_${now.toISOString()}.json`;
    mimeType = 'application/json';
  } else {
    fileContent = formatCsv(data);
    filename = `leaf_ledger_journal_entries_export_${now.toISOString()}.csv`;
    mimeType = 'text/csv';
  }

  const file = new File(Paths.cache, filename);

  try {
    file.create();
    file.write(fileContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType });
      return true;
    } else {
      alert('Sharing is not available on this platform.');
      return false;
    }
  } catch (error) {
    console.error('Error exporting or sharing file:', error);
    return false;
  }
}
