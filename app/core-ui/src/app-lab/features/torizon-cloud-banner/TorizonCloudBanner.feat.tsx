import { openLinkExternal } from '@cloud-editor-mono/domain/src/services/services-by-app/app-lab';
import { Torizon } from '@cloud-editor-mono/images/assets/icons';
import {
  Button,
  ButtonAppearance,
  ButtonSize,
  ButtonVariant,
  Text,
  TextSize,
  TORIZON_CLOUD_URL,
  useI18n,
} from '@cloud-editor-mono/ui-components/lib/components-by-app/app-lab';
import { useNavigate } from '@tanstack/react-router';

import { useTorizonCloud } from '../../hooks/useTorizonCloud';
import { messages } from './messages';
import styles from './torizonCloudBanner.module.scss';

const TorizonCloudBanner: React.FC = () => {
  const { formatMessage } = useI18n();
  const navigate = useNavigate();
  const { status } = useTorizonCloud();

  if (!status) {
    return null;
  }

  const { device } = status;

  const onAction = (): void => {
    if (device) {
      openLinkExternal(TORIZON_CLOUD_URL);
    } else {
      navigate({ to: '/settings', hash: 'torizon-cloud' });
    }
  };

  return (
    <div className={styles['banner']}>
      <div className={styles['header']}>
        <Torizon className={styles['icon']} aria-hidden="true" />
        <Text size={TextSize.XXSmall} className={styles['title']}>
          {formatMessage(messages.title)}
        </Text>
      </div>
      {device ? (
        <>
          <Text size={TextSize.XXXSmall} className={styles['status']}>
            <span className={styles['dot']} />
            {formatMessage(messages.provisioned, { deviceName: device.name })}
          </Text>
          {device.app && (
            <Text size={TextSize.XXXSmall} className={styles['description']}>
              {device.app}
            </Text>
          )}
        </>
      ) : (
        <Text size={TextSize.XXXSmall} className={styles['description']}>
          {formatMessage(messages.description)}
        </Text>
      )}
      <Button
        variant={ButtonVariant.Primary}
        appearance={
          device ? ButtonAppearance.LowContrast : ButtonAppearance.Action
        }
        size={ButtonSize.XXSmall}
        classes={{ button: styles['action'] }}
        onClick={onAction}
      >
        {formatMessage(device ? messages.open : messages.configure)}
      </Button>
    </div>
  );
};

export default TorizonCloudBanner;
