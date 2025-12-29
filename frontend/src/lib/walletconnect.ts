import SignClient from '@walletconnect/sign-client';
export const initWC = async () => {
  const signClient = await SignClient.init({
    projectId: 'YOUR_PROJECT_ID',
    metadata: {
      name: 'IP-BLUE',
      description: 'Integrated Protocol BLUE',
      url: 'https://ip-blue.xyz',
      icons: ['https://walletconnect.com/walletconnect-logo.png']
    }
  });
  return signClient;
};
// Additional WC logic
export const connectWC = async (client) => {
  const { uri, approval } = await client.connect({
    requiredNamespaces: {
      stacks: {
        methods: ['stacks_signTransaction'],
