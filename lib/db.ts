import * as SQLite from 'expo-sqlite';

import type {
  CreateLogInput,
  CreateReptileInput,
  LogEntry,
  LogType,
  Reptile,
  ReptileCareSummary,
  UpdateLogInput,
  UpdateReptileInput,
} from './types';

const DATABASE_NAME = 'shedandfed.db';

let database: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let operationChain: Promise<unknown> = Promise.resolve();

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = operationChain.then(operation, operation);
  operationChain = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await initializeSchema(db);
  database = db;
  return db;
}

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  if (!initPromise) {
    initPromise = openDatabase();
  }

  return initPromise;
}

export async function initDatabase(): Promise<void> {
  await getDatabase();
}

async function initializeSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reptiles (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS log_entries (
      id TEXT PRIMARY KEY NOT NULL,
      reptile_id TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      food TEXT,
      amount TEXT,
      shed_quality TEXT,
      poop_quality TEXT,
      hot_side REAL,
      cool_side REAL,
      ambient REAL,
      weight REAL,
      weight_unit TEXT,
      FOREIGN KEY (reptile_id) REFERENCES reptiles(id) ON DELETE CASCADE
    );
  `);

  await db.execAsync(
    'CREATE INDEX IF NOT EXISTS idx_log_entries_reptile_id ON log_entries(reptile_id);'
  );
  await db.execAsync('CREATE INDEX IF NOT EXISTS idx_log_entries_date ON log_entries(date);');

  try {
    await db.execAsync('ALTER TABLE log_entries ADD COLUMN poop_quality TEXT;');
  } catch {
    // Column already exists on upgraded databases.
  }

  try {
    await db.execAsync('ALTER TABLE reptiles ADD COLUMN feeding_interval_days INTEGER;');
  } catch {
    // Column already exists on upgraded databases.
  }

  try {
    await db.execAsync(
      'ALTER TABLE reptiles ADD COLUMN feeding_reminders_enabled INTEGER NOT NULL DEFAULT 0;'
    );
  } catch {
    // Column already exists on upgraded databases.
  }

  try {
    await db.execAsync('ALTER TABLE reptiles ADD COLUMN image_uri TEXT;');
  } catch {
    // Column already exists on upgraded databases.
  }

  try {
    await db.execAsync('ALTER TABLE log_entries ADD COLUMN health_category TEXT;');
  } catch {
    // Column already exists on upgraded databases.
  }
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
    feedingIntervalDays:
      row.feeding_interval_days != null ? Number(row.feeding_interval_days) : null,
    feedingRemindersEnabled: Boolean(row.feeding_reminders_enabled),
    imageUri: (row.image_uri as string | null) ?? null,
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
    poopQuality: (row.poop_quality as string | null) ?? null,
    healthCategory: (row.health_category as string | null) ?? null,
    hotSide: row.hot_side != null ? Number(row.hot_side) : null,
    coolSide: row.cool_side != null ? Number(row.cool_side) : null,
    ambient: row.ambient != null ? Number(row.ambient) : null,
    weight: row.weight != null ? Number(row.weight) : null,
    weightUnit: (row.weight_unit as LogEntry['weightUnit']) ?? null,
  };
}

export function getReptiles(): Promise<Reptile[]> {
  return enqueue(async () => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      'SELECT * FROM reptiles ORDER BY name COLLATE NOCASE ASC'
    );
    return rows.map(mapReptile);
  });
}

export function getReptile(id: string): Promise<Reptile | null> {
  return enqueue(async () => {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Record<string, unknown>>(
      'SELECT * FROM reptiles WHERE id = ?',
      [id]
    );
    return row ? mapReptile(row) : null;
  });
}

export function createReptile(input: CreateReptileInput): Promise<Reptile> {
  return enqueue(async () => {
    const db = await getDatabase();
    const reptile: Reptile = {
      id: generateId(),
      name: input.name.trim(),
      species: input.species.trim(),
      notes: input.notes?.trim() || null,
      feedingIntervalDays: input.feedingIntervalDays ?? null,
      feedingRemindersEnabled: input.feedingRemindersEnabled ?? false,
      imageUri: input.imageUri ?? null,
      createdAt: new Date().toISOString(),
    };

    await db.runAsync(
      `INSERT INTO reptiles (
        id, name, species, notes, feeding_interval_days, feeding_reminders_enabled, image_uri, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reptile.id,
        reptile.name,
        reptile.species,
        reptile.notes,
        reptile.feedingIntervalDays,
        reptile.feedingRemindersEnabled ? 1 : 0,
        reptile.imageUri,
        reptile.createdAt,
      ]
    );

    return reptile;
  });
}

export function updateReptile(input: UpdateReptileInput): Promise<Reptile> {
  return enqueue(async () => {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Record<string, unknown>>(
      'SELECT * FROM reptiles WHERE id = ?',
      [input.id]
    );
    if (!row) {
      throw new Error('Reptile not found');
    }

    const reptile: Reptile = {
      ...mapReptile(row),
      name: input.name.trim(),
      species: input.species.trim(),
      notes: input.notes?.trim() || null,
      feedingIntervalDays: input.feedingIntervalDays ?? null,
      feedingRemindersEnabled: input.feedingRemindersEnabled ?? false,
      imageUri: input.imageUri !== undefined ? input.imageUri : mapReptile(row).imageUri,
    };

    await db.runAsync(
      `UPDATE reptiles SET
        name = ?, species = ?, notes = ?, feeding_interval_days = ?, feeding_reminders_enabled = ?,
        image_uri = ?
      WHERE id = ?`,
      [
        reptile.name,
        reptile.species,
        reptile.notes,
        reptile.feedingIntervalDays,
        reptile.feedingRemindersEnabled ? 1 : 0,
        reptile.imageUri,
        reptile.id,
      ]
    );

    return reptile;
  });
}

export function deleteReptile(id: string): Promise<void> {
  return enqueue(async () => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM log_entries WHERE reptile_id = ?', [id]);
    await db.runAsync('DELETE FROM reptiles WHERE id = ?', [id]);
  });
}

export function getLogsForReptile(reptileId: string): Promise<LogEntry[]> {
  return enqueue(async () => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      'SELECT * FROM log_entries WHERE reptile_id = ? ORDER BY date DESC',
      [reptileId]
    );
    return rows.map(mapLogEntry);
  });
}

export function getRecentLogs(limit = 50): Promise<(LogEntry & { reptileName: string })[]> {
  return enqueue(async () => {
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
  });
}

export function createLog(input: CreateLogInput): Promise<LogEntry> {
  return enqueue(async () => {
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
      poopQuality: input.poopQuality?.trim() || null,
      healthCategory: input.healthCategory?.trim() || null,
      hotSide: input.hotSide ?? null,
      coolSide: input.coolSide ?? null,
      ambient: input.ambient ?? null,
      weight: input.weight ?? null,
      weightUnit: input.weightUnit ?? null,
    };

    await db.runAsync(
      `INSERT INTO log_entries (
        id, reptile_id, type, date, notes, food, amount, shed_quality, poop_quality,
        health_category, hot_side, cool_side, ambient, weight, weight_unit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.reptileId,
        entry.type,
        entry.date,
        entry.notes,
        entry.food,
        entry.amount,
        entry.shedQuality,
        entry.poopQuality,
        entry.healthCategory,
        entry.hotSide,
        entry.coolSide,
        entry.ambient,
        entry.weight,
        entry.weightUnit,
      ]
    );

    return entry;
  });
}

export function getLog(id: string): Promise<LogEntry | null> {
  return enqueue(async () => {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Record<string, unknown>>(
      'SELECT * FROM log_entries WHERE id = ?',
      [id]
    );
    return row ? mapLogEntry(row) : null;
  });
}

export function updateLog(input: UpdateLogInput): Promise<LogEntry> {
  return enqueue(async () => {
    const db = await getDatabase();
    const entry: LogEntry = {
      id: input.id,
      reptileId: input.reptileId,
      type: input.type,
      date: input.date,
      notes: input.notes?.trim() || null,
      food: input.food?.trim() || null,
      amount: input.amount?.trim() || null,
      shedQuality: input.shedQuality?.trim() || null,
      poopQuality: input.poopQuality?.trim() || null,
      healthCategory: input.healthCategory?.trim() || null,
      hotSide: input.hotSide ?? null,
      coolSide: input.coolSide ?? null,
      ambient: input.ambient ?? null,
      weight: input.weight ?? null,
      weightUnit: input.weightUnit ?? null,
    };

    await db.runAsync(
      `UPDATE log_entries SET
        type = ?, date = ?, notes = ?, food = ?, amount = ?, shed_quality = ?, poop_quality = ?,
        health_category = ?, hot_side = ?, cool_side = ?, ambient = ?, weight = ?, weight_unit = ?
      WHERE id = ?`,
      [
        entry.type,
        entry.date,
        entry.notes,
        entry.food,
        entry.amount,
        entry.shedQuality,
        entry.poopQuality,
        entry.healthCategory,
        entry.hotSide,
        entry.coolSide,
        entry.ambient,
        entry.weight,
        entry.weightUnit,
        entry.id,
      ]
    );

    return entry;
  });
}

export function deleteLog(id: string): Promise<void> {
  return enqueue(async () => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM log_entries WHERE id = ?', [id]);
  });
}

const CARE_SUMMARY_TYPES: LogType[] = ['feeding', 'shedding', 'poop'];

export function getCareSummaries(): Promise<Record<string, ReptileCareSummary>> {
  return enqueue(async () => {
    const db = await getDatabase();
    const placeholders = CARE_SUMMARY_TYPES.map(() => '?').join(', ');
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT reptile_id, type, MAX(date) AS last_date
       FROM log_entries
       WHERE type IN (${placeholders})
       GROUP BY reptile_id, type`,
      CARE_SUMMARY_TYPES
    );

    const summaries: Record<string, ReptileCareSummary> = {};

    for (const row of rows) {
      const reptileId = row.reptile_id as string;
      const type = row.type as LogType;
      const lastDate = row.last_date as string;

      if (!summaries[reptileId]) {
        summaries[reptileId] = {
          reptileId,
          lastFed: null,
          lastShed: null,
          lastPoop: null,
        };
      }

      if (type === 'feeding') summaries[reptileId].lastFed = lastDate;
      if (type === 'shedding') summaries[reptileId].lastShed = lastDate;
      if (type === 'poop') summaries[reptileId].lastPoop = lastDate;
    }

    return summaries;
  });
}

export function getLastFeeding(reptileId: string): Promise<LogEntry | null> {
  return enqueue(async () => {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Record<string, unknown>>(
      `SELECT * FROM log_entries
       WHERE reptile_id = ? AND type = 'feeding'
       ORDER BY date DESC
       LIMIT 1`,
      [reptileId]
    );
    return row ? mapLogEntry(row) : null;
  });
}
