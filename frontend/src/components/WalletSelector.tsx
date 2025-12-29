import React from 'react';
import { Button } from './ui/Button';
import { authenticate } from '../lib/stacks';
import { initWC } from '../lib/walletconnect';
export const WalletSelector = () => {
  const handleWC = async () => {
    const client = await initWC();
    console.log('WC Client Initialized', client);
  };
  return (
    <div className='flex flex-col gap-4 p-6 bg-card border border-border rounded-2xl'>
      <h2 className='text-xl font-bold'>Connect Wallet</h2>
      <Button onClick={authenticate} className='bg-primary text-white'>Connect Stacks (Leather/Xverse)</Button>
      <Button onClick={handleWC} className='bg-secondary text-white'>Connect via WalletConnect</Button>
    </div>
  );
};
