import { AppDetailedInfo, AppStatus } from '@cloud-editor-mono/infrastructure';

import {
  CreateAppDialogLogic,
  DeleteAppDialogLogic,
  ExportAppDialogLogic,
  TorizonCloudPublishDialogLogic,
} from '../../../dialogs';

export enum AppAction {
  Rename = 'RENAME',
  Duplicate = 'DUPLICATE',
  Export = 'Export',
  PublishToTorizonCloud = 'PUBLISH_TO_TORIZON_CLOUD',
  Delete = 'DELETE',
}

export type AppTitleLogic = () => {
  app: AppDetailedInfo | undefined;
  appStatus?: AppStatus;
  name: string;
  editing: boolean;
  hasError: boolean;
  defaultApp?: AppDetailedInfo;
  setAsDefaultApp?: (isSelected: boolean) => Promise<void>;
  openApp?: (app: AppDetailedInfo) => void;
  onAppNameChange: (value: string) => void;
  onAppAction: (action: AppAction) => void;
  canPublishToTorizonCloud?: boolean;
  onResetAppName: () => void;
  onRenameApp: () => void;
  onUpdateAppIcon: (emoji: string) => Promise<boolean>;
  deleteAppDialogLogic: DeleteAppDialogLogic;
  createAppDialogLogic: CreateAppDialogLogic;
  exportAppDialogLogic: ExportAppDialogLogic;
  torizonCloudPublishDialogLogic: TorizonCloudPublishDialogLogic;
};
