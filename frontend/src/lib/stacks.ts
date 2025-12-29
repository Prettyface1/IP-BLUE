import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });
export const network = new StacksTestnet();
export const authenticate = () => {
  showConnect({
    appDetails: {
      name: 'IP-BLUE',
      icon: window.location.origin + '/logo.png',
    },
