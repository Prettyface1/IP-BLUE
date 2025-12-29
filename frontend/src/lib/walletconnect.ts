import SignClient from '@walletconnect/sign-client';
export const initWC = async () => {
  const signClient = await SignClient.init({
    projectId: 'YOUR_PROJECT_ID',
    metadata: {
