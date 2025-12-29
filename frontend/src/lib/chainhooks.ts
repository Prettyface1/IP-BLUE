import { ChainhooksClient } from '@hirosystems/chainhooks-client';
export const setupChainhooks = () => {
  const client = new ChainhooksClient({
    baseUrl: 'https://api.hirosystems.com',
    apiKey: 'YOUR_API_KEY'
  });
  return client;
};
export const listenToIPRegistry = (client) => {
  client.subscribe({
    event: 'contract_call',
