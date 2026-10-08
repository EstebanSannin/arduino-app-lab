import {
  onTorizonCloudUploadProgress,
  openLinkExternal,
  prepareTorizonCloudRelease,
  uploadTorizonCloudRelease,
} from '@cloud-editor-mono/domain/src/services/services-by-app/app-lab';
import { AppDetailedInfo } from '@cloud-editor-mono/infrastructure';
import {
  TORIZON_CLOUD_URL,
  TorizonCloudPublishDialogLogic,
  TorizonCloudPublishStage,
  TorizonCloudRelease,
} from '@cloud-editor-mono/ui-components/lib/components-by-app/app-lab';
import { useCallback, useState } from 'react';

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const useTorizonCloudPublish = (
  app: AppDetailedInfo | undefined,
): {
  startPublish: () => void;
  publishDialogLogic: TorizonCloudPublishDialogLogic;
} => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<TorizonCloudPublishStage>('preparing');
  const [release, setRelease] = useState<TorizonCloudRelease>();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>();

  const fail = (e: unknown): void => {
    setError(errorMessage(e));
    setStage('error');
  };

  const startPublish = useCallback((): void => {
    if (!app) return;
    setOpen(true);
    setStage('preparing');
    setRelease(undefined);
    setError(undefined);
    prepareTorizonCloudRelease(app.id)
      .then((r) => {
        setRelease(r);
        setStage('ready');
      })
      .catch(fail);
  }, [app]);

  const onPublish = (): void => {
    setStage('uploading');
    setProgress(0);
    const stopProgress = onTorizonCloudUploadProgress(setProgress);
    uploadTorizonCloudRelease()
      .then(() => setStage('published'))
      .catch(fail)
      .finally(stopProgress);
  };

  const publishDialogLogic = useCallback(
    () => ({
      open,
      onOpenChange: setOpen,
      appName: [app?.icon, app?.name].join(' '),
      stage,
      release,
      progress,
      error,
      onPublish,
      onOpenTorizonCloud: (): void => openLinkExternal(TORIZON_CLOUD_URL),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, app, stage, release, progress, error],
  );

  return { startPublish, publishDialogLogic };
};
