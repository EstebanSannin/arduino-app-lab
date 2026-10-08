import { Success, Torizon } from '@cloud-editor-mono/images/assets/icons';

import { useI18n, XXSmall } from '../../shared';
import { Badge, BadgeStyle, BadgeVariant } from '../essential/badge';
import {
  Button,
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
} from '../essential/button';
import { SettingsSection } from '../settings-section';
import { torizonCloudMessages as messages } from './messages';
import styles from './torizon-cloud.module.scss';
import { UseTorizonCloudLogic } from './torizonCloud.type';

export const TORIZON_CLOUD_URL = 'https://app.torizon.io';

interface TorizonCloudSettingsProps {
  logic: UseTorizonCloudLogic;
  boardName?: string;
  onOpenExternal: (url: string) => void;
}

export const TorizonCloudSettings: React.FC<TorizonCloudSettingsProps> = ({
  logic,
  boardName,
  onOpenExternal,
}: TorizonCloudSettingsProps) => {
  const { formatMessage } = useI18n();
  const { status, isLoading, error, importCredentials, provision, disconnect } =
    logic();

  if (!status) {
    return null;
  }

  const { device } = status;

  return (
    <section id="torizon-cloud">
      <SettingsSection.Title
        title={formatMessage(messages.title)}
        icon={<Torizon className={styles['icon']} />}
        variant="secondary"
      />
      <SettingsSection.Card>
        {!status.configured && (
          <SettingsSection.Row label={formatMessage(messages.connectTitle)}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              variant={ButtonVariant.Secondary}
              size={ButtonSize.XXSmall}
              onClick={importCredentials}
            >
              {formatMessage(messages.importAction)}
            </Button>
          </SettingsSection.Row>
        )}
        {status.configured && !status.provisioned && (
          <SettingsSection.Row label={formatMessage(messages.provisionTitle)}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              variant={ButtonVariant.Secondary}
              size={ButtonSize.XXSmall}
              onClick={(): void => provision(boardName ?? '')}
            >
              {formatMessage(messages.provisionAction, { boardName })}
            </Button>
          </SettingsSection.Row>
        )}
        {device && (
          <>
            <SettingsSection.Row label={formatMessage(messages.connectedTitle)}>
              <Badge
                classes={{ container: styles['badge'] }}
                uppercase={false}
                icon={<Success />}
                style={BadgeStyle.Light}
                variant={BadgeVariant.Positive}
              >
                {formatMessage(messages.connectedBadge)}
              </Badge>
            </SettingsSection.Row>
            <SettingsSection.Row label={formatMessage(messages.deviceName)}>
              {device.name}
            </SettingsSection.Row>
            <SettingsSection.Row label={formatMessage(messages.deviceId)}>
              {device.id}
            </SettingsSection.Row>
            <SettingsSection.Row label={formatMessage(messages.deviceStatus)}>
              {device.status}
            </SettingsSection.Row>
            <SettingsSection.Row label={formatMessage(messages.cloudApp)}>
              {device.app || '-'}
            </SettingsSection.Row>
          </>
        )}
        <SettingsSection.Row
          classes={{ label: styles['description'] }}
          label={formatMessage(messages.description)}
        >
          <SettingsSection.ExternalLink
            href={TORIZON_CLOUD_URL}
            onOpenExternal={onOpenExternal}
            label={formatMessage(messages.openAction)}
          />
        </SettingsSection.Row>
        {error && <XXSmall className={styles['error']}>{error}</XXSmall>}
        {status.configured && (
          <>
            <SettingsSection.Divider />
            <SettingsSection.Row
              label={formatMessage(messages.disconnectTitle)}
            >
              <Button
                disabled={isLoading}
                appearance={ButtonAppearance.LowContrast}
                variant={ButtonVariant.Primary}
                size={ButtonSize.XXSmall}
                onClick={disconnect}
              >
                {formatMessage(messages.disconnectAction)}
              </Button>
            </SettingsSection.Row>
          </>
        )}
      </SettingsSection.Card>
    </section>
  );
};
