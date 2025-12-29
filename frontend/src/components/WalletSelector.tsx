import React from 'react';
import { Button } from './ui/Button';
import { authenticate } from '../lib/stacks';
import { initWC } from '../lib/walletconnect';
export const WalletSelector = () => {
  const handleWC = async () => {
    const client = await initWC();
