import { ChainhooksClient } from '@hirosystems/chainhooks-client';
export const setupChainhooks = () => {
  const client = new ChainhooksClient({
    baseUrl: 'https://api.hirosystems.com',
    apiKey: 'YOUR_API_KEY'
