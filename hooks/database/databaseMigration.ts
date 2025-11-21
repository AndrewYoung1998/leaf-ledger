import { type SQLiteDatabase } from 'expo-sqlite';
import {executeSqlAsync} from "@/hooks/database/useDatabase";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;

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