import {
  TorizonCloudRelease,
  TorizonCloudStatus,
} from '@cloud-editor-mono/ui-components/lib/components-by-app/app-lab';

export interface TorizonCloudService {
  getTorizonCloudStatus(): Promise<TorizonCloudStatus>;
  importTorizonCloudCredentials(): Promise<boolean>;
  deleteTorizonCloudCredentials(): Promise<void>;
  provisionTorizonCloudDevice(name: string): Promise<void>;
  prepareTorizonCloudRelease(appId: string): Promise<TorizonCloudRelease>;
  uploadTorizonCloudRelease(): Promise<TorizonCloudRelease>;
  onTorizonCloudUploadProgress(handler: (percent: number) => void): () => void;
  onTorizonCloudBuildLog(handler: (line: string) => void): () => void;
}
