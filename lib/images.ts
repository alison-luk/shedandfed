import * as FileSystem from 'expo-file-system/legacy';

const REPTILE_PHOTOS_DIR = `${FileSystem.documentDirectory}reptiles/`;

export async function ensureReptilePhotosDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(REPTILE_PHOTOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(REPTILE_PHOTOS_DIR, { intermediates: true });
  }
}

export function reptilePhotoPath(reptileId: string): string {
  return `${REPTILE_PHOTOS_DIR}${reptileId}.jpg`;
}

export async function persistReptilePhoto(reptileId: string, sourceUri: string): Promise<string> {
  await ensureReptilePhotosDir();
  const dest = reptilePhotoPath(reptileId);
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}

export async function deleteReptilePhoto(reptileId: string): Promise<void> {
  const path = reptilePhotoPath(reptileId);
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) {
    await FileSystem.deleteAsync(path, { idempotent: true });
  }
}
