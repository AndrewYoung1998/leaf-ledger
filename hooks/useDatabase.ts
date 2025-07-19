import { Category } from '@/interfaces/Categories';
import { EntryCategory } from '@/interfaces/EntryCategories';
import { EntryTag } from '@/interfaces/EntryTags';
import { JournalEntry } from '@/interfaces/JournalEntries';
import { ProductConsumption } from '@/interfaces/ProductConsumption';
import { Tag } from '@/interfaces/Tags';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('leafledger.db');

function executeSqlAsync(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
  // db.runAsync already returns a Promise, so no need for 'new Promise' wrapper.
  // It's the correct method for executing DDL (CREATE TABLE) and DML (INSERT, UPDATE, DELETE)
  // statements with parameters.
  return db.runAsync(sql, params)
    .then((result) => {
      // console.log("SQL Execution Result:", result); // Uncomment for debugging if needed
      return result;
    })
    .catch((error) => {
      console.error("Error executing SQL:", sql, "with params:", params, "Error:", error);
      throw error; // Re-throw to propagate the error
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

export async function getJournalEntries(where?: string, params: any[] = []): Promise<JournalEntry[]> {
  let query = 'SELECT * FROM JournalEntries';
  if (where) {
    query += ` WHERE ${where}`;
  }
  // Use fetchSqlAsync for SELECT queries to get the actual rows
  return await fetchSqlAsync<JournalEntry>(query, params);
}
async function fetchSqlAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    // db.getAllAsync is specifically for SELECT queries that return multiple rows.
    const rows = await db.getAllAsync(sql, params);
    return rows as T[]; // Cast to the expected array of objects
  } catch (error) {
    console.error("Error executing SQL (getAllAsync):", sql, "with params:", params, "Error:", error);
    throw error;
  }
}
async function editJournalEntry(entry_id: number, title: string, content: string) {
  return executeSqlAsync(
    `UPDATE JournalEntries SET title = ?, content = ? WHERE entry_id = ?`,
    [title, content, entry_id]
  );
}
async function deleteJournalEntry(entry_id: number) {
  return executeSqlAsync(
    `DELETE FROM JournalEntries WHERE entry_id = ?`,
    [entry_id]
  );
}
async function deleteJournalEntries() {
  return executeSqlAsync(
    `DELETE FROM JournalEntries`
  );
}
async function addTag(tag: Tag) {
  return executeSqlAsync(
    `INSERT INTO Tags (tag_name) VALUES (?)`,
    [tag.tag_name]
  );
}
async function getTags(): Promise<Tag[]> {
  return fetchSqlAsync<Tag>(`SELECT * FROM Tags`);
}
async function deleteTag(tag_id: number) {
  return executeSqlAsync(
    `DELETE FROM Tags WHERE tag_id = ?`,
    [tag_id]
  );
}
async function addEntryTag(entry_tag: EntryTag) {
  return executeSqlAsync(
    `INSERT INTO EntryTags (tag_id, entry_id) VALUES (?, ?)`,
    [entry_tag.tag_id, entry_tag.entry_id]
  );
}
async function getEntryTags(): Promise<EntryTag[]> {
  return fetchSqlAsync<EntryTag>(`SELECT * FROM EntryTags`);
}
async function deleteEntryTag(entry_tag_id: number) {
  return executeSqlAsync(
    `DELETE FROM EntryTags WHERE entry_tag_id = ?`,
    [entry_tag_id]
  );
}
async function addCategory(category: Category) {
  return executeSqlAsync(
    `INSERT INTO Categories (category_name) VALUES (?)`,
    [category.category_name]
  );
}
async function getCategories(): Promise<Category[]> {
  return fetchSqlAsync<Category>(`SELECT * FROM Categories`);
}
async function deleteCategory(category_id: number) {
  return executeSqlAsync(
    `DELETE FROM Categories WHERE category_id = ?`,
    [category_id]
  );
}
async function addEntryCategory(entry_category: EntryCategory) {
  return executeSqlAsync(
    `INSERT INTO EntryCategories (category_id, entry_id) VALUES (?, ?)`,
    [entry_category.category_id, entry_category.entry_id]
  );
}
async function getEntryCategories(): Promise<EntryCategory[]> {
  return fetchSqlAsync<EntryCategory>(`SELECT * FROM EntryCategories`);
}
async function deleteEntryCategory(entry_category_id: number) {
  return executeSqlAsync(
    `DELETE FROM EntryCategories WHERE entry_category_id = ?`,
    [entry_category_id]
  );
}
async function addProductConsumption(product_consumption: ProductConsumption) {
  return executeSqlAsync(
    `INSERT INTO ProductConsumption (consumption_type, quantity, unit, details, consumption_time, entry_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [product_consumption.consumption_type, product_consumption.quantity, product_consumption.unit, product_consumption.details, product_consumption.consumption_time, product_consumption.entry_id]
  );
}
async function getProductConsumptions(): Promise<ProductConsumption[]> {
  return fetchSqlAsync<ProductConsumption>(`SELECT * FROM ProductConsumption`);
}
async function deleteProductConsumption(consumption_id: number) {
  return executeSqlAsync(
    `DELETE FROM ProductConsumption WHERE consumption_id = ?`,
    [consumption_id]
  );
}

// Add similar CRUD functions for Tags, EntryTags, Categories, EntryCategories, ProductConsumption as needed

export default {
  initializeDatabase,
  addJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
  deleteJournalEntries,
  editJournalEntry,
  addTag,
  getTags,
  deleteTag,
  addEntryTag,
  getEntryTags,
  deleteEntryTag,
  addCategory,
  getCategories,
  deleteCategory,
  addEntryCategory,
  getEntryCategories,
  deleteEntryCategory,
  addProductConsumption,
  getProductConsumptions,
  deleteProductConsumption,
};