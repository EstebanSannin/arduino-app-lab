import {
  Success,
  Torizon,
  TriangleSharp,
} from '@cloud-editor-mono/images/assets/icons';
import clsx from 'clsx';
import { IntRange } from 'type-fest';

import { Button, ButtonVariant } from '../../../components-by-app/app-lab';
import { TorizonCloudRelease } from '../../../components-by-app/app-lab/torizon-cloud/torizonCloud.type';
import { ErrorBanner } from '../../../error-banner/ErrorBanner';
import { ProgressBar } from '../../../essential/progress-bar';
import { useI18n } from '../../../i18n/useI18n';
import { AppLabDialog } from '../app-lab-dialog/AppLabDialog';
import { messages } from './messages';
import styles from './torizon-cloud-publish-dialog.module.scss';

export type TorizonCloudPublishStage =
  | 'preparing'
  | 'ready'
  | 'uploading'
  | 'published'
  | 'error';

export type TorizonCloudPublishDialogLogic = () => {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName?: string;
  stage: TorizonCloudPublishStage;
  release?: TorizonCloudRelease;
  progress: number;
  error?: string;
  onPublish: () => void;
  onOpenTorizonCloud: () => void;
};

type TorizonCloudPublishDialogProps = { logic: TorizonCloudPublishDialogLogic };

const formatSize = (bytes: number): string =>
  `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export const TorizonCloudPublishDialog: React.FC<
  TorizonCloudPublishDialogProps
> = ({ logic }: TorizonCloudPublishDialogProps) => {
  const {
    open,
    onOpenChange,
    appName,
    stage,
    release,
    progress,
    error,
    onPublish,
    onOpenTorizonCloud,
  } = logic();
  const { formatMessage } = useI18n();

  const close = (): void => onOpenChange(false);

  const footer =
    stage === 'published' ? (
      <>
        <Button variant={ButtonVariant.Secondary} onClick={close}>
          {formatMessage(messages.close)}
        </Button>
        <Button variant={ButtonVariant.Primary} onClick={onOpenTorizonCloud}>
          {formatMessage(messages.openTorizonCloud)}
        </Button>
      </>
    ) : stage === 'error' ? (
      <Button variant={ButtonVariant.Primary} onClick={close}>
        {formatMessage(messages.close)}
      </Button>
    ) : (
      <>
        <Button
          variant={ButtonVariant.Secondary}
          onClick={close}
          disabled={stage === 'uploading'}
        >
          {formatMessage(messages.cancel)}
        </Button>
        <Button
          variant={ButtonVariant.Primary}
          type="submit"
          loading={stage === 'uploading'}
          disabled={stage !== 'ready'}
        >
          {formatMessage(messages.publish)}
        </Button>
      </>
    );

  return (
    <AppLabDialog
      open={open}
      onOpenChange={(isOpen): void => {
        if (stage !== 'uploading') onOpenChange(isOpen);
      }}
      title={formatMessage(messages.title)}
      onSubmit={onPublish}
      footer={footer}
      classes={{ body: styles['body'] }}
    >
      <div className={styles['header']}>
        {stage === 'published' ? (
          <Success className={clsx(styles['icon'], styles['success'])} />
        ) : stage === 'error' ? (
          <TriangleSharp className={clsx(styles['icon'], styles['warning'])} />
        ) : (
          <Torizon className={styles['icon']} />
        )}
        <h2 className={styles['title']}>{appName}</h2>
      </div>
      <p
        className={clsx(styles['description'], {
          [styles['success']]: stage === 'published',
        })}
      >
        {formatMessage(messages[stage])}
      </p>
      {release && stage !== 'error' && (
        <dl className={styles['recap']}>
          <dt>{formatMessage(messages.package)}</dt>
          <dd>{release.name}</dd>
          <dt>{formatMessage(messages.version)}</dt>
          <dd>{release.version}</dd>
          <dt>{formatMessage(messages.hardwareId)}</dt>
          <dd>{release.hardwareId}</dd>
          <dt>{formatMessage(messages.size)}</dt>
          <dd>{formatSize(release.size)}</dd>
        </dl>
      )}
      {(stage === 'preparing' || stage === 'uploading') && (
        <div className={styles['progress']}>
          <ProgressBar
            active
            progress={
              stage === 'uploading'
                ? (Math.min(progress, 100) as IntRange<0, 101>)
                : undefined
            }
          />
        </div>
      )}
      {error && <ErrorBanner message={error} />}
    </AppLabDialog>
  );
};
