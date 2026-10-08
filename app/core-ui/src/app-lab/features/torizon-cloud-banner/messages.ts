import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  title: {
    id: 'app-lab.torizon-cloud-banner.title',
    defaultMessage: 'Torizon Cloud',
    description: 'Title of the Torizon Cloud promo banner',
  },
  description: {
    id: 'app-lab.torizon-cloud-banner.description',
    defaultMessage:
      'Publish your apps and update boards and fleets remotely and securely, from anywhere.',
    description: 'Description of the Torizon Cloud promo banner',
  },
  provisioned: {
    id: 'app-lab.torizon-cloud-banner.provisioned',
    defaultMessage: '{deviceName} provisioned',
    description: 'Torizon Cloud banner status when the board is provisioned',
  },
  configure: {
    id: 'app-lab.torizon-cloud-banner.configure',
    defaultMessage: 'Configure',
    description: 'Torizon Cloud banner call-to-action when not configured',
  },
  open: {
    id: 'app-lab.torizon-cloud-banner.open',
    defaultMessage: 'Open',
    description: 'Torizon Cloud banner call-to-action when provisioned',
  },
});
