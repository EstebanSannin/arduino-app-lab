import { Torizon } from '@cloud-editor-mono/images/assets/icons';
import {
  Button,
  ButtonVariant,
  useI18n,
} from '@cloud-editor-mono/ui-components/lib/components-by-app/app-lab';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { TorizonCloudStatus } from '../../../torizon-cloud';
import { messages } from '../../messages';
import networkStyles from '../network/network.module.scss';
import networkPanelStyles from '../network-panel/network-panel.module.scss';
import Panel from '../panel/Panel';
import styles from './torizon-cloud.module.scss';

interface TorizonCloudProps {
  status: TorizonCloudStatus;
  onOpenCloud: () => void;
  onOpenSettings: () => void;
}

export const TorizonCloud: React.FC<TorizonCloudProps> = ({
  status,
  onOpenCloud,
  onOpenSettings,
}: TorizonCloudProps) => {
  const { formatMessage } = useI18n();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLDivElement>(null);
  const { device } = status;

  useEffect(() => {
    if (!isMenuVisible) return;
    function handleClickOutside(event: MouseEvent): void {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !menuTriggerRef.current?.contains(event.target as Node)
      ) {
        setMenuVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuVisible]);

  const toggleMenu = (): void => setMenuVisible(!isMenuVisible);

  const onAction = (): void => {
    setMenuVisible(false);
    if (device) {
      onOpenCloud();
    } else {
      onOpenSettings();
    }
  };

  return (
    <div
      ref={menuTriggerRef}
      role="button"
      tabIndex={0}
      aria-label={formatMessage(messages.torizonCloudPanelTitle)}
      onClick={toggleMenu}
      onKeyUp={toggleMenu}
    >
      <div
        className={clsx(networkStyles['network-icon-container'], {
          [networkStyles['active']]: isMenuVisible,
          [styles['connected']]: !!device,
        })}
      >
        <Torizon className={styles['icon']} />
      </div>
      {isMenuVisible && (
        <Panel
          ref={menuRef}
          triggerRef={menuTriggerRef}
          title={formatMessage(messages.torizonCloudPanelTitle)}
          icon={<Torizon className={styles['icon']} />}
          action={
            <Button
              variant={ButtonVariant.Secondary}
              onClick={onAction}
              classes={{
                button: networkPanelStyles['network-button'],
                textButtonText: networkPanelStyles['network-button-text'],
              }}
            >
              {formatMessage(
                device
                  ? messages.torizonCloudPanelOpen
                  : messages.torizonCloudPanelConfigure,
              )}
            </Button>
          }
          classes={{ menuContent: networkPanelStyles['network-menu-content'] }}
        >
          {device && (
            <>
              <span className={networkPanelStyles['network-item']}>
                {formatMessage(messages.torizonCloudPanelDevice, {
                  name: device.name,
                })}
              </span>
              <span className={networkPanelStyles['network-item']}>
                {formatMessage(messages.torizonCloudPanelApp, {
                  app: device.app || '-',
                })}
              </span>
            </>
          )}
          <span
            className={clsx(networkPanelStyles['network-status'], {
              [networkPanelStyles['connected']]: !!device,
            })}
          >
            {device
              ? device.status
              : formatMessage(messages.torizonCloudPanelNotProvisioned)}
          </span>
        </Panel>
      )}
    </div>
  );
};
