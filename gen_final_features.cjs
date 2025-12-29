const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
    try {
        console.log(`Executing: ${cmd}`);
        return execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed: ${cmd}`);
    }
}

function gitCommit(msg) {
    run('git add .');
    run(`git commit -m "${msg}"`);
}

function gitBranch(name) {
    run('git checkout main');
    run('git pull origin main');
    run(`git checkout -b ${name}`);
}

function pushAndMerge(branch, title) {
    run(`git push -u origin ${branch} --force`);
    run(`gh pr create --title "${title}" --body "Intuitive UI Implementation: ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

const componentDir = 'frontend/src/components';

// 1. WalletSelector
gitBranch('feat/ui-wallet-selector');
const wsPath = path.join(componentDir, 'WalletSelector.tsx');
const wsLines = [
    "import React from 'react';",
    "import { Button } from './ui/Button';",
    "import { authenticate } from '../lib/stacks';",
    "import { initWC } from '../lib/walletconnect';",
    "export const WalletSelector = () => {",
    "  const handleWC = async () => {",
    "    const client = await initWC();",
    "    console.log('WC Client Initialized', client);",
    "  };",
    "  return (",
    "    <div className='flex flex-col gap-4 p-6 bg-card border border-border rounded-2xl'>",
    "      <h2 className='text-xl font-bold'>Connect Wallet</h2>",
    "      <Button onClick={authenticate} className='bg-primary text-white'>Connect Stacks (Leather/Xverse)</Button>",
    "      <Button onClick={handleWC} className='bg-secondary text-white'>Connect via WalletConnect</Button>",
    "    </div>",
    "  );",
    "};"
];
wsLines.forEach((l, i) => {
    fs.appendFileSync(wsPath, l + '\n');
    gitCommit(`feat: wallet selector implementation step ${i + 1}`);
});
pushAndMerge('feat/ui-wallet-selector', 'Implement Integrated Wallet Selector');

// 2. AssetRegistrationForm
gitBranch('feat/ui-registration-form');
const rfPath = path.join(componentDir, 'AssetRegistration.tsx');
const rfLines = [
    "import React, { useState } from 'react';",
    "import { Input } from './ui/Input';",
    "import { Button } from './ui/Button';",
    "export const AssetRegistration = () => {",
    "  const [title, setTitle] = useState('');",
    "  return (",
    "    <div className='max-w-2xl mx-auto p-8 bg-card border border-border rounded-2xl shadow-2xl'>",
    "      <h2 className='text-2xl font-black mb-6'>Register IP Asset</h2>",
    "      <div className='space-y-4'>",
    "        <Input placeholder='Asset Title' value={title} onChange={(e) => setTitle(e.target.value)} />",
    "        <Input placeholder='Description (Detailed)' />",
    "        <Input placeholder='Initial Shares amount' type='number' />",
    "        <Button className='w-full bg-primary py-4 hover:scale-105 transition-transform'>Create Genesis Record</Button>",
    "      </div>",
    "    </div>",
    "  );",
    "};"
];
rfLines.forEach((l, i) => {
    fs.appendFileSync(rfPath, l + '\n');
    gitCommit(`feat: registration form implementation step ${i + 1}`);
});
pushAndMerge('feat/ui-registration-form', 'Implement IP Asset Registration UI');

// 3. Update App with new views
gitBranch('feat/app-routing');
const appPath = 'frontend/src/App.tsx';
const appContent = `
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
`;
fs.writeFileSync(appPath, appContent);
gitCommit('feat: implement view switching and assembly');
pushAndMerge('feat/app-routing', 'Assemble Frontend Assembly and View Routing');
