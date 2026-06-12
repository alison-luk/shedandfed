import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import * as db from '@/lib/db';
import { deleteReptilePhoto } from '@/lib/images';
import { syncFeedingReminders } from '@/lib/notifications';
import type {
  CreateLogInput,
  CreateReptileInput,
  LogEntry,
  Reptile,
  ReptileCareSummary,
  UpdateLogInput,
  UpdateReptileInput,
} from '@/lib/types';

interface DataContextValue {
  reptiles: Reptile[];
  recentLogs: (LogEntry & { reptileName: string })[];
  careSummaries: Record<string, ReptileCareSummary>;
  loading: boolean;
  refresh: () => Promise<void>;
  addReptile: (input: CreateReptileInput) => Promise<Reptile>;
  editReptile: (input: UpdateReptileInput) => Promise<Reptile>;
  removeReptile: (id: string) => Promise<void>;
  addLog: (input: CreateLogInput) => Promise<LogEntry>;
  editLog: (input: UpdateLogInput) => Promise<LogEntry>;
  removeLog: (id: string) => Promise<void>;
  getReptileLogs: (reptileId: string) => Promise<LogEntry[]>;
}

const DataContext = createContext<DataContextValue | null>(null);

const EMPTY_SUMMARIES: Record<string, ReptileCareSummary> = {};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [recentLogs, setRecentLogs] = useState<(LogEntry & { reptileName: string })[]>([]);
  const [careSummaries, setCareSummaries] = useState<Record<string, ReptileCareSummary>>(EMPTY_SUMMARIES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [nextReptiles, nextLogs, nextSummaries] = await Promise.all([
      db.getReptiles(),
      db.getRecentLogs(),
      db.getCareSummaries(),
    ]);
    setReptiles(nextReptiles);
    setRecentLogs(nextLogs);
    setCareSummaries(nextSummaries);
    await syncFeedingReminders(nextReptiles, nextSummaries);
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

  const editReptile = useCallback(
    async (input: UpdateReptileInput) => {
      const reptile = await db.updateReptile(input);
      await refresh();
      return reptile;
    },
    [refresh]
  );

  const removeReptile = useCallback(
    async (id: string) => {
      await deleteReptilePhoto(id);
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
      careSummaries,
      loading,
      refresh,
      addReptile,
      editReptile,
      removeReptile,
      addLog,
      editLog,
      removeLog,
      getReptileLogs,
    }),
    [
      reptiles,
      recentLogs,
      careSummaries,
      loading,
      refresh,
      addReptile,
      editReptile,
      removeReptile,
      addLog,
      editLog,
      removeLog,
      getReptileLogs,
    ]
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
