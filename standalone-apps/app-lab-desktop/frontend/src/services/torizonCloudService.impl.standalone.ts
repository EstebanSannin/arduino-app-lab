import { TorizonCloudService } from '@cloud-editor-mono/domain/src/services/services-by-app/app-lab';

import {
  DeleteTorizonCloudCredentials,
  GetTorizonCloudStatus,
  ImportTorizonCloudCredentials,
  PrepareTorizonCloudRelease,
  ProvisionTorizonCloudDevice,
  UploadTorizonCloudRelease,
} from '../../wailsjs/go/app/App';
import { EventsOn } from '../../wailsjs/runtime/runtime';

export const getTorizonCloudStatus: TorizonCloudService['getTorizonCloudStatus'] =
  GetTorizonCloudStatus;

export const importTorizonCloudCredentials: TorizonCloudService['importTorizonCloudCredentials'] =
  ImportTorizonCloudCredentials;

export const deleteTorizonCloudCredentials: TorizonCloudService['deleteTorizonCloudCredentials'] =
  DeleteTorizonCloudCredentials;

export const provisionTorizonCloudDevice: TorizonCloudService['provisionTorizonCloudDevice'] =
  ProvisionTorizonCloudDevice;

export const prepareTorizonCloudRelease: TorizonCloudService['prepareTorizonCloudRelease'] =
  PrepareTorizonCloudRelease;

export const uploadTorizonCloudRelease: TorizonCloudService['uploadTorizonCloudRelease'] =
  UploadTorizonCloudRelease;

export const onTorizonCloudUploadProgress: TorizonCloudService['onTorizonCloudUploadProgress'] =
  (handler) => EventsOn('torizon-cloud:upload-progress', handler);
