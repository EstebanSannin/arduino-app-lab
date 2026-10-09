import { defineMessages } from 'react-intl';

export const torizonCloudMessages = defineMessages({
  title: {
    id: 'appLabSettings.torizonCloud.title',
    defaultMessage: 'Torizon Cloud',
    description: 'Title for the Torizon Cloud section',
  },
  description: {
    id: 'appLabSettings.torizonCloud.description',
    defaultMessage: 'Publish apps and update devices remotely.',
    description: 'Description of the Torizon Cloud section',
  },
  importAction: {
    id: 'appLabSettings.torizonCloud.importAction',
    defaultMessage: 'Import API client',
    description: 'Button to import the Torizon Cloud API client file',
  },
  connectTitle: {
    id: 'appLabSettings.torizonCloud.connectTitle',
    defaultMessage: 'Connect App Lab to Torizon Cloud',
    description: 'Label of the Torizon Cloud API client import row',
  },
  connectedTitle: {
    id: 'appLabSettings.torizonCloud.connectedTitle',
    defaultMessage: 'Torizon Cloud status',
    description: 'Label of the Torizon Cloud status row',
  },
  deviceName: {
    id: 'appLabSettings.torizonCloud.deviceName',
    defaultMessage: 'Device name',
    description: 'Label of the Torizon Cloud device name',
  },
  provisionTitle: {
    id: 'appLabSettings.torizonCloud.provisionTitle',
    defaultMessage: 'Provision this board',
    description: 'Label of the Torizon Cloud provisioning row',
  },
  provisionAction: {
    id: 'appLabSettings.torizonCloud.provisionAction',
    defaultMessage: 'Provision',
    description: 'Button to provision the board in Torizon Cloud',
  },
  provisionDescription: {
    id: 'appLabSettings.torizonCloud.provisionDescription',
    defaultMessage:
      'Register this board in your Torizon Cloud account. The name must be unique in the account.',
    description: 'Description of the Torizon Cloud provisioning dialog',
  },
  provisioning: {
    id: 'appLabSettings.torizonCloud.provisioning',
    defaultMessage: 'Registering this board in Torizon Cloud...',
    description: 'Shown while the board is provisioned',
  },
  provisioned: {
    id: 'appLabSettings.torizonCloud.provisioned',
    defaultMessage: 'This board is now in Torizon Cloud as {name}',
    description: 'Shown when the board has been provisioned',
  },
  done: {
    id: 'appLabSettings.torizonCloud.done',
    defaultMessage: 'Done',
    description: 'Button closing the provisioning dialog',
  },
  connectedBadge: {
    id: 'appLabSettings.torizonCloud.connectedBadge',
    defaultMessage: 'Connected',
    description: 'Badge shown when the board is in Torizon Cloud',
  },
  deviceId: {
    id: 'appLabSettings.torizonCloud.deviceId',
    defaultMessage: 'Device ID',
    description: 'Label of the Torizon Cloud device ID',
  },
  deviceStatus: {
    id: 'appLabSettings.torizonCloud.deviceStatus',
    defaultMessage: 'Status',
    description: 'Label of the Torizon Cloud device status',
  },
  cloudApp: {
    id: 'appLabSettings.torizonCloud.cloudApp',
    defaultMessage: 'App from Torizon Cloud',
    description: 'Label of the last app installed from Torizon Cloud',
  },
  openAction: {
    id: 'appLabSettings.torizonCloud.openAction',
    defaultMessage: 'Open Torizon Cloud',
    description: 'Link to the Torizon Cloud web UI',
  },
  disconnectTitle: {
    id: 'appLabSettings.torizonCloud.disconnectTitle',
    defaultMessage: 'Remove the API client',
    description: 'Label of the Torizon Cloud disconnect row',
  },
  disconnectAction: {
    id: 'appLabSettings.torizonCloud.disconnectAction',
    defaultMessage: 'Disconnect',
    description: 'Button to remove the Torizon Cloud API client',
  },
});
