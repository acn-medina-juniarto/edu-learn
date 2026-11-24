/**
 * Backup / restore of everything the site stores (all bj:v1:* keys).
 * The file is plain JSON the learner keeps; nothing is uploaded anywhere.
 */
export const BACKUP_APP = 'biz-nihongo';
export const BACKUP_VERSION = 1;
export const STORAGE_PREFIX = 'bj:v1:';

export interface BackupFile {
  app: typeof BACKUP_APP;
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

interface StorageLike {
  length: number;
  key(i: number): string | null;
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export function siteKeys(storage: StorageLike): string[] {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k?.startsWith(STORAGE_PREFIX)) keys.push(k);
  }
  return keys.sort();
}

export function buildBackup(storage: StorageLike, now = new Date()): BackupFile {
  const data: Record<string, unknown> = {};
  for (const k of siteKeys(storage)) {
    const raw = storage.getItem(k);
    if (raw === null) continue;
    try {
      data[k] = JSON.parse(raw);
    } catch {
      /* skip unreadable values */
    }
  }
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: now.toISOString(), data };
}

export type ParseResult = { ok: true; backup: BackupFile } | { ok: false; error: string };

export function parseBackup(text: string): ParseResult {
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file isn't valid JSON." };
  }
  const b = v as Partial<BackupFile>;
  if (!b || typeof b !== 'object' || b.app !== BACKUP_APP) {
    return { ok: false, error: "This doesn't look like a Biz Nihongo backup file." };
  }
  if (b.version !== BACKUP_VERSION) {
    return { ok: false, error: `Unsupported backup version (${String(b.version)}).` };
  }
  if (!b.data || typeof b.data !== 'object') return { ok: false, error: 'The backup has no data.' };
  const bad = Object.keys(b.data).filter((k) => !k.startsWith(STORAGE_PREFIX));
  if (bad.length) return { ok: false, error: `Unexpected keys in backup: ${bad.join(', ')}` };
  return { ok: true, backup: b as BackupFile };
}

/** Replace all site data with the backup's data. */
export function restoreBackup(storage: StorageLike, b: BackupFile): number {
  for (const k of siteKeys(storage)) storage.removeItem(k);
  const entries = Object.entries(b.data);
  for (const [k, v] of entries) storage.setItem(k, JSON.stringify(v));
  return entries.length;
}

/** Remove all site data (progress, deck, prefs, email fields). */
export function resetAll(storage: StorageLike): void {
  for (const k of siteKeys(storage)) storage.removeItem(k);
}

/** Summary for the confirm dialog. */
export function describeBackup(b: BackupFile): { lessons: number; cards: number; days: number } {
  const progress = b.data['bj:v1:progress'] as { lessons?: object; activeDays?: unknown[] } | undefined;
  const deck = b.data['bj:v1:deck'] as { cards?: object } | undefined;
  return {
    lessons: Object.keys(progress?.lessons ?? {}).length,
    cards: Object.keys(deck?.cards ?? {}).length,
    days: progress?.activeDays?.length ?? 0,
  };
}
