import { useEffect, useState } from 'react';

import { AppLabDialog } from '../../../dialogs/app-lab/app-lab-dialog/AppLabDialog';
import { ErrorBanner } from '../../../error-banner/ErrorBanner';
import { Input, InputStyle } from '../../../essential/input';
import { ProgressBar } from '../../../essential/progress-bar';
import { useI18n, XXSmall } from '../../shared';
import { Button, ButtonSize } from '../essential/button';
import { torizonCloudMessages as messages } from './messages';
import styles from './torizon-cloud.module.scss';

interface TorizonCloudProvisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName?: string;
  isLoading: boolean;
  error?: string;
  onProvision: (name: string) => void;
}

export const TorizonCloudProvisionDialog: React.FC<
  TorizonCloudProvisionDialogProps
> = ({
  open,
  onOpenChange,
  defaultName,
  isLoading,
  error,
  onProvision,
}: TorizonCloudProvisionDialogProps) => {
  const { formatMessage } = useI18n();
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) setName(defaultName ?? '');
  }, [open, defaultName]);

  return (
    <AppLabDialog
      open={open}
      onOpenChange={(isOpen): void => {
        if (!isLoading) onOpenChange(isOpen);
      }}
      title={formatMessage(messages.provisionTitle)}
      onSubmit={(): void => onProvision(name.trim())}
      footer={
        <Button
          loading={isLoading}
          size={ButtonSize.Small}
          disabled={isLoading || !name.trim()}
          type="submit"
        >
          {formatMessage(messages.provisionAction)}
        </Button>
      }
      classes={{ body: styles['dialog'] }}
    >
      <XXSmall className={styles['dialog-description']}>
        {formatMessage(messages.provisionDescription)}
      </XXSmall>
      <Input
        inputStyle={InputStyle.AppLab}
        id="torizon-cloud-device-name"
        value={name}
        onChange={(value): void => setName(value as string)}
        label={formatMessage(messages.deviceName)}
        disabled={isLoading}
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus
      />
      {isLoading && (
        <>
          <XXSmall className={styles['dialog-description']}>
            {formatMessage(messages.provisioning)}
          </XXSmall>
          <div className={styles['progress']}>
            <ProgressBar active />
          </div>
        </>
      )}
      {error && !isLoading && <ErrorBanner message={error} />}
    </AppLabDialog>
  );
};
