export interface TorizonCloudDevice {
  uuid: string;
  id: string;
  name: string;
  status: string;
  lastSeen: string;
  app: string;
}

export interface TorizonCloudStatus {
  configured: boolean;
  provisioned: boolean;
  device?: TorizonCloudDevice;
}

export interface TorizonCloudRelease {
  name: string;
  version: string;
  hardwareId: string;
  size: number;
}

export type UseTorizonCloudLogic = () => {
  status?: TorizonCloudStatus;
  isLoading: boolean;
  error?: string;
  importCredentials: () => void;
  provision: (name: string) => void;
  disconnect: () => void;
};
