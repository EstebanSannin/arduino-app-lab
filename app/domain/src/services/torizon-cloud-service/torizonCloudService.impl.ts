import { TorizonCloudService } from './torizon-cloud-service.type';

export let getTorizonCloudStatus: TorizonCloudService['getTorizonCloudStatus'] =
  async function () {
    throw new Error('getTorizonCloudStatus service not implemented');
  };

export let importTorizonCloudCredentials: TorizonCloudService['importTorizonCloudCredentials'] =
  async function () {
    throw new Error('importTorizonCloudCredentials service not implemented');
  };

export let deleteTorizonCloudCredentials: TorizonCloudService['deleteTorizonCloudCredentials'] =
  async function () {
    throw new Error('deleteTorizonCloudCredentials service not implemented');
  };

export let provisionTorizonCloudDevice: TorizonCloudService['provisionTorizonCloudDevice'] =
  async function () {
    throw new Error('provisionTorizonCloudDevice service not implemented');
  };

export let prepareTorizonCloudRelease: TorizonCloudService['prepareTorizonCloudRelease'] =
  async function () {
    throw new Error('prepareTorizonCloudRelease service not implemented');
  };

export let uploadTorizonCloudRelease: TorizonCloudService['uploadTorizonCloudRelease'] =
  async function () {
    throw new Error('uploadTorizonCloudRelease service not implemented');
  };

export let onTorizonCloudUploadProgress: TorizonCloudService['onTorizonCloudUploadProgress'] =
  function () {
    throw new Error('onTorizonCloudUploadProgress service not implemented');
  };

export let onTorizonCloudBuildLog: TorizonCloudService['onTorizonCloudBuildLog'] =
  function () {
    throw new Error('onTorizonCloudBuildLog service not implemented');
  };

export const setTorizonCloudService = (service: TorizonCloudService): void => {
  getTorizonCloudStatus = service.getTorizonCloudStatus;
  importTorizonCloudCredentials = service.importTorizonCloudCredentials;
  deleteTorizonCloudCredentials = service.deleteTorizonCloudCredentials;
  provisionTorizonCloudDevice = service.provisionTorizonCloudDevice;
  prepareTorizonCloudRelease = service.prepareTorizonCloudRelease;
  uploadTorizonCloudRelease = service.uploadTorizonCloudRelease;
  onTorizonCloudUploadProgress = service.onTorizonCloudUploadProgress;
  onTorizonCloudBuildLog = service.onTorizonCloudBuildLog;
};
