import * as SQLite from 'expo-sqlite';

import type { CreateLogInput, CreateReptileInput, LogEntry, Reptile } from './types';

const DATABASE_NAME = 'shedandfed.db';

let database: SQLite.SQLiteDatabase | null = null;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!database) {
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await initializeSchema(database);
  }
  return database;
}

async function initializeSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS reptiles (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS log_entries (
      id TEXT PRIMARY KEY NOT NULL,
      reptile_id TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      food TEXT,
      amount TEXT,
      shed_quality TEXT,
      hot_side REAL,
      cool_side REAL,
      ambient REAL,
      weight REAL,
      weight_unit TEXT,
      FOREIGN KEY (reptile_id) REFERENCES reptiles(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_log_entries_reptile_id ON log_entries(reptile_id);
    CREATE INDEX IF NOT EXISTS idx_log_entries_date ON log_entries(date DESC);
  `);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function mapReptile(row: Record<string, unknown>): Reptile {
  return {
    id: row.id as string,
    name: row.name as string,
    species: row.species as string,
    notes: (row.notes as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

function mapLogEntry(row: Record<string, unknown>): LogEntry {
  return {
    id: row.id as string,
    reptileId: row.reptile_id as string,
    type: row.type as LogEntry['type'],
    date: row.date as string,
    notes: (row.notes as string | null) ?? null,
    food: (row.food as string | null) ?? null,
    amount: (row.amount as string | null) ?? null,
    shedQuality: (row.shed_quality as string | null) ?? null,
    hotSide: row.hot_side != null ? Number(row.hot_side) : null,
    coolSide: row.cool_side != null ? Number(row.cool_side) : null,
    ambient: row.ambient != null ? Number(row.ambient) : null,
    weight: row.weight != null ? Number(row.weight) : null,
    weightUnit: (row.weight_unit as LogEntry['weightUnit']) ?? null,
  };
}

export async function getReptiles(): Promise<Reptile[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM reptiles ORDER BY name COLLATE NOCASE ASC'
  );
  return rows.map(mapReptile);
}

export async function getReptile(id: string): Promise<Reptile | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM reptiles WHERE id = ?',
    [id]
  );
  return row ? mapReptile(row) : null;
}

export async function createReptile(input: CreateReptileInput): Promise<Reptile> {
  const db = await getDatabase();
  const reptile: Reptile = {
    id: generateId(),
    name: input.name.trim(),
    species: input.species.trim(),
    notes: input.notes?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  await db.runAsync(
    'INSERT INTO reptiles (id, name, species, notes, created_at) VALUES (?, ?, ?, ?, ?)',
    [reptile.id, reptile.name, reptile.species, reptile.notes, reptile.createdAt]
  );

  return reptile;
}

export async function deleteReptile(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM log_entries WHERE reptile_id = ?', [id]);
  await db.runAsync('DELETE FROM reptiles WHERE id = ?', [id]);
}

export async function getLogsForReptile(reptileId: string): Promise<LogEntry[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM log_entries WHERE reptile_id = ? ORDER BY date DESC',
    [reptileId]
  );
  return rows.map(mapLogEntry);
}

export async function getRecentLogs(limit = 50): Promise<(LogEntry & { reptileName: string })[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT log_entries.*, reptiles.name AS reptile_name
     FROM log_entries
     JOIN reptiles ON reptiles.id = log_entries.reptile_id
     ORDER BY log_entries.date DESC
     LIMIT ?`,
    [limit]
  );

  return rows.map((row) => ({
    ...mapLogEntry(row),
    reptileName: row.reptile_name as string,
  }));
}

export async function createLog(input: CreateLogInput): Promise<LogEntry> {
  const db = await getDatabase();
  const entry: LogEntry = {
    id: generateId(),
    reptileId: input.reptileId,
    type: input.type,
    date: input.date,
    notes: input.notes?.trim() || null,
    food: input.food?.trim() || null,
    amount: input.amount?.trim() || null,
    shedQuality: input.shedQuality?.trim() || null,
    hotSide: input.hotSide ?? null,
    coolSide: input.coolSide ?? null,
    ambient: input.ambient ?? null,
    weight: input.weight ?? null,
    weightUnit: input.weightUnit ?? null,
  };

  await db.runAsync(
    `INSERT INTO log_entries (
      id, reptile_id, type, date, notes, food, amount, shed_quality,
      hot_side, cool_side, ambient, weight, weight_unit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.reptileId,
      entry.type,
      entry.date,
      entry.notes,
      entry.food,
      entry.amount,
      entry.shedQuality,
      entry.hotSide,
      entry.coolSide,
      entry.ambient,
      entry.weight,
      entry.weightUnit,
    ]
  );

  return entry;
}

export async function deleteLog(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM log_entries WHERE id = ?', [id]);
}
