import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/ui/Navbar';
import { Sidebar } from './components/ui/Sidebar';
const App = () => {
  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar className='w-64 border-r border-border' />
      <div className='flex-1 flex flex-col'>
        <Navbar className='h-16 border-b border-border' />
        <main className='flex-1 overflow-y-auto'>
          <Dashboard />
        </main>
      </div>
    </div>
  );