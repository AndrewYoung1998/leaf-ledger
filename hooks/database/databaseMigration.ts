import { executeSqlAsync } from "@/hooks/database/useDatabase";
import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 2;

    const result = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );

    let currentDbVersion = result?.user_version ?? 0;
    console.log('Current DB version:', currentDbVersion);
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    if (currentDbVersion === 0) {
        console.log('Migrating to version 1');

        await addPhotoUriColumn()

        currentDbVersion = 1;
    }

    if (currentDbVersion === 1) {
        console.log('Migrating to version 2');

        await convertPhotoUriToArray(db);

        currentDbVersion = 2;
    }

    // Update database version
    await db.execAsync(`PRAGMA user_version = ${currentDbVersion}`);
}

async function addPhotoUriColumn(): Promise<void> {
    console.log('Adding photo_uri column...');
    // SQLite only allows ADD COLUMN, RENAME TABLE, and RENAME COLUMN via ALTER TABLE.
    await executeSqlAsync(`
        ALTER TABLE JournalEntries ADD COLUMN photo_uri TEXT;
    `);

    console.log('photo_uri column added.');
}

async function convertPhotoUriToArray(db: SQLiteDatabase): Promise<void> {
    console.log('Converting photo_uri to JSON array format...');

    // Get all entries with non-null photo_uri
    const entries = await db.getAllAsync<{ entry_id: number; photo_uri: string | null }>(
        'SELECT entry_id, photo_uri FROM JournalEntries WHERE photo_uri IS NOT NULL AND photo_uri != ""'
    );

    for (const entry of entries) {
        if (entry.photo_uri) {
            // Check if it's already a JSON array
            let photoArray: string[];
            try {
                const parsed = JSON.parse(entry.photo_uri);
                photoArray = Array.isArray(parsed) ? parsed : [entry.photo_uri];
            } catch {
                // Not JSON, treat as single URI
                photoArray = [entry.photo_uri];
            }

            // Update with JSON array
            await executeSqlAsync(
                'UPDATE JournalEntries SET photo_uri = ? WHERE entry_id = ?',
                [JSON.stringify(photoArray), entry.entry_id]
            );
        }
    }

    console.log('photo_uri converted to JSON array format.');
}