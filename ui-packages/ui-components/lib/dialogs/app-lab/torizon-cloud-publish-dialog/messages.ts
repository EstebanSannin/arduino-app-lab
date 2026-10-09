import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  title: {
    id: 'appLab.torizonCloudPublishDialog.title',
    defaultMessage: 'Publish to Torizon Cloud',
    description: 'Title of the Torizon Cloud publish dialog',
  },
  preparing: {
    id: 'appLab.torizonCloudPublishDialog.preparing',
    defaultMessage: 'Building a release of the app on the board...',
    description: 'Shown while the release is built on the board',
  },
  ready: {
    id: 'appLab.torizonCloudPublishDialog.ready',
    defaultMessage:
      'This release will be uploaded to Torizon Cloud, ready to be deployed to your devices and fleets.',
    description: 'Shown when the release is ready to be published',
  },
  uploading: {
    id: 'appLab.torizonCloudPublishDialog.uploading',
    defaultMessage: 'Uploading to Torizon Cloud...',
    description: 'Shown while the release is uploaded',
  },
  published: {
    id: 'appLab.torizonCloudPublishDialog.published',
    defaultMessage:
      'Published. Deploy it to your devices and fleets from Torizon Cloud.',
    description: 'Shown when the release is in Torizon Cloud',
  },
  error: {
    id: 'appLab.torizonCloudPublishDialog.error',
    defaultMessage: 'The app could not be published.',
    description: 'Shown when publishing fails',
  },
  stepBuild: {
    id: 'appLab.torizonCloudPublishDialog.stepBuild',
    defaultMessage: 'Build the release on the board',
    description: 'Publish step: build the release',
  },
  stepUpload: {
    id: 'appLab.torizonCloudPublishDialog.stepUpload',
    defaultMessage: 'Upload to Torizon Cloud',
    description: 'Publish step: upload the release',
  },
  publishedVersions: {
    id: 'appLab.torizonCloudPublishDialog.publishedVersions',
    defaultMessage: 'Already in Torizon Cloud',
    description: 'Label of the versions of the app already in Torizon Cloud',
  },
  noneYet: {
    id: 'appLab.torizonCloudPublishDialog.noneYet',
    defaultMessage: 'No versions yet',
    description: 'Shown when the app has no versions in Torizon Cloud',
  },
  package: {
    id: 'appLab.torizonCloudPublishDialog.package',
    defaultMessage: 'Package',
    description: 'Label of the package name',
  },
  version: {
    id: 'appLab.torizonCloudPublishDialog.version',
    defaultMessage: 'Version',
    description: 'Label of the package version',
  },
  hardwareId: {
    id: 'appLab.torizonCloudPublishDialog.hardwareId',
    defaultMessage: 'Hardware ID',
    description: 'Label of the package hardware ID',
  },
  size: {
    id: 'appLab.torizonCloudPublishDialog.size',
    defaultMessage: 'Size',
    description: 'Label of the package size',
  },
  publish: {
    id: 'appLab.torizonCloudPublishDialog.publish',
    defaultMessage: 'Publish',
    description: 'Button publishing the release',
  },
  cancel: {
    id: 'appLab.torizonCloudPublishDialog.cancel',
    defaultMessage: 'Cancel',
    description: 'Button closing the dialog without publishing',
  },
  close: {
    id: 'appLab.torizonCloudPublishDialog.close',
    defaultMessage: 'Close',
    description: 'Button closing the dialog',
  },
  openTorizonCloud: {
    id: 'appLab.torizonCloudPublishDialog.openTorizonCloud',
    defaultMessage: 'Open Torizon Cloud',
    description: 'Button opening the Torizon Cloud web UI',
  },
});
