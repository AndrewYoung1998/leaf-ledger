import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('leafledger.db');

function executeSqlAsync(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const result = db.execSync(sql);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

export async function initializeDatabase() {
  // Create tables
  await executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS JournalEntries (
      entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      entry_date TEXT,
      created_at TEXT,
      updated_at TEXT
    );
  `);

  await executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS Tags (
      tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag_name TEXT UNIQUE
    );
  `);

  await executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS EntryTags (
      entry_tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag_id INTEGER,
      entry_id INTEGER,
      FOREIGN KEY (tag_id) REFERENCES Tags(tag_id),
      FOREIGN KEY (entry_id) REFERENCES JournalEntries(entry_id)
    );
  `);

  await executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS Categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT UNIQUE
    );
  `);

  await executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS EntryCategories (
      entry_category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      entry_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES Categories(category_id),
      FOREIGN KEY (entry_id) REFERENCES JournalEntries(entry_id)
    );
  `);

  await executeSqlAsync(`
    CREATE TABLE IF NOT EXISTS ProductConsumption (
      consumption_id INTEGER PRIMARY KEY AUTOINCREMENT,
      consumption_type TEXT,
      quantity REAL,
      unit TEXT,
      details TEXT,
      consumption_time TEXT,
      entry_id INTEGER,
      FOREIGN KEY (entry_id) REFERENCES JournalEntries(entry_id)
    );
  `);
}

// Example CRUD for JournalEntries
export async function addJournalEntry(entry: {
  title: string;
  content: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
}) {
  return executeSqlAsync(
    `INSERT INTO JournalEntries (title, content, entry_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    [entry.title, entry.content, entry.entry_date, entry.created_at, entry.updated_at]
  );
}

export async function getJournalEntries(where?: string, params: any[] = []) {
  let query = 'SELECT * FROM JournalEntries';
  if (where) query += ` WHERE ${where}`;
  return (await executeSqlAsync(query, params)).rows._array;
}

// Add similar CRUD functions for Tags, EntryTags, Categories, EntryCategories, ProductConsumption as needed

export default {
  initializeDatabase,
  addJournalEntry,
  getJournalEntries,
  // ...other CRUD functions
};