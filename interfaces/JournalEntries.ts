export interface JournalEntry {
    entry_id: number;
    title: string;
    content: string;
    entry_date: string; // Assuming ISO string or similar
    created_at: string;
    updated_at: string;
  }