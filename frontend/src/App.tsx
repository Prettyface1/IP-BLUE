
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/ui/Navbar';
import { Sidebar } from './components/ui/Sidebar';
import { WalletSelector } from './components/WalletSelector';
import { AssetRegistration } from './components/AssetRegistration';

const App = () => {
  const [view, setView] = useState('dashboard');
  
  return (
    <div className='flex h-screen overflow-hidden bg-background text-foreground'>
      <Sidebar className='w-64 border-r border-border' />
      <div className='flex-1 flex flex-col'>
        <Navbar className='h-16 border-b border-border' />
        <main className='flex-1 overflow-y-auto p-8'>
          <div className='flex justify-end mb-8'>
            <WalletSelector />
          </div>
          {view === 'dashboard' ? <Dashboard /> : <AssetRegistration />}
          <div className='mt-8 flex gap-4'>
             <button onClick={() => setView('dashboard')} className='p-2 bg-secondary rounded'>Dashboard</button>
             <button onClick={() => setView('register')} className='p-2 bg-secondary rounded'>Register IP</button>
          </div>
        </main>
      </div>
    </div>
  );
};
export default App;
