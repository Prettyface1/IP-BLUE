import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
export const AssetRegistration = () => {
  const [title, setTitle] = useState('');
  return (
    <div className='max-w-2xl mx-auto p-8 bg-card border border-border rounded-2xl shadow-2xl'>
      <h2 className='text-2xl font-black mb-6'>Register IP Asset</h2>
      <div className='space-y-4'>
        <Input placeholder='Asset Title' value={title} onChange={(e) => setTitle(e.target.value)} />
