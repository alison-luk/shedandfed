import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import * as db from '@/lib/db';
import type { CreateLogInput, CreateReptileInput, LogEntry, Reptile, UpdateLogInput } from '@/lib/types';

interface DataContextValue {
  reptiles: Reptile[];
  recentLogs: (LogEntry & { reptileName: string })[];
  loading: boolean;
  refresh: () => Promise<void>;
  addReptile: (input: CreateReptileInput) => Promise<Reptile>;
  removeReptile: (id: string) => Promise<void>;
  addLog: (input: CreateLogInput) => Promise<LogEntry>;
  editLog: (input: UpdateLogInput) => Promise<LogEntry>;
  removeLog: (id: string) => Promise<void>;
  getReptileLogs: (reptileId: string) => Promise<LogEntry[]>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [recentLogs, setRecentLogs] = useState<(LogEntry & { reptileName: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const nextReptiles = await db.getReptiles();
    const nextLogs = await db.getRecentLogs();
    setReptiles(nextReptiles);
    setRecentLogs(nextLogs);
  }, []);

  useEffect(() => {
    db.initDatabase()
      .then(() => refresh())
      .catch((error) => {
        console.error('Failed to initialize database', error);
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  const addReptile = useCallback(
    async (input: CreateReptileInput) => {
      const reptile = await db.createReptile(input);
      await refresh();
      return reptile;
    },
    [refresh]
  );

  const removeReptile = useCallback(
    async (id: string) => {
      await db.deleteReptile(id);
      await refresh();
    },
    [refresh]
  );

  const addLog = useCallback(
    async (input: CreateLogInput) => {
      const entry = await db.createLog(input);
      await refresh();
      return entry;
    },
    [refresh]
  );

  const editLog = useCallback(
    async (input: UpdateLogInput) => {
      const entry = await db.updateLog(input);
      await refresh();
      return entry;
    },
    [refresh]
  );

  const removeLog = useCallback(
    async (id: string) => {
      await db.deleteLog(id);
      await refresh();
    },
    [refresh]
  );

  const getReptileLogs = useCallback((reptileId: string) => db.getLogsForReptile(reptileId), []);

  const value = useMemo(
    () => ({
      reptiles,
      recentLogs,
      loading,
      refresh,
      addReptile,
      removeReptile,
      addLog,
      editLog,
      removeLog,
      getReptileLogs,
    }),
    [reptiles, recentLogs, loading, refresh, addReptile, removeReptile, addLog, editLog, removeLog, getReptileLogs]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
