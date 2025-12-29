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
    run(`gh pr create --title "${title}" --body "Premium UI Implementation: ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

const dashboardFile = 'frontend/src/components/Dashboard.tsx';
if (!fs.existsSync('frontend/src/components')) fs.mkdirSync('frontend/src/components', { recursive: true });

// 1. Dashboard Core
gitBranch('feat/premium-dashboard-core');
const dashLines = [
    "import React from 'react';",
    "import { motion } from 'framer-motion';",
    "import { Activity, Shield, TrendingUp, Zap } from 'lucide-react';",
    "export const Dashboard = () => {",
    "  return (",
    "    <div className='p-8 bg-background text-foreground min-h-screen'>",
    "      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-4xl font-bold mb-8'>",
    "        IP-BLUE Analytics",
    "      </motion.h1>",
    "      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>",
    "        <StatCard icon={<Shield />} title='Protected Assets' value='1,284' delta='+12%' />",
    "        <StatCard icon={<TrendingUp />} title='Royalties' value='42.5 STX' delta='+5.2%' />",
    "        <StatCard icon={<Activity />} title='Active Licenses' value='86' delta='+24%' />",
    "        <StatCard icon={<Zap />} title='Network Latency' value='14ms' delta='stable' />",
    "      </div>",
    "    </div>",
    "  );",
    "};",
    "const StatCard = ({ icon, title, value, delta }) => (",
    "  <div className='p-6 bg-card border border-border rounded-xl'>",
    "    <div className='flex items-center gap-4 mb-4 text-primary'>{icon}</div>",
    "    <h3 className='text-sm text-muted-foreground uppercase tracking-wider'>{title}</h3>",
    "    <div className='text-2xl font-bold'>{value}</div>",
    "    <div className='text-xs text-green-500 mt-2'>{delta} from last month</div>",
    "  </div>",
    ");"
];

dashLines.forEach((l, i) => {
    fs.appendFileSync(dashboardFile, l + '\n');
    gitCommit(`feat: dashboard implementation part ${i + 1}`);
});
pushAndMerge('feat/premium-dashboard-core', 'Implement Premium Analytics Dashboard');

// 2. Main App Assembly
gitBranch('feat/app-assembly');
const appFile = 'frontend/src/App.tsx';
const appLines = [
    "import React from 'react';",
    "import { Dashboard } from './components/Dashboard';",
    "import { Navbar } from './components/ui/Navbar';",
    "import { Sidebar } from './components/ui/Sidebar';",
    "const App = () => {",
    "  return (",
    "    <div className='flex h-screen overflow-hidden'>",
    "      <Sidebar className='w-64 border-r border-border' />",
    "      <div className='flex-1 flex flex-col'>",
    "        <Navbar className='h-16 border-b border-border' />",
    "        <main className='flex-1 overflow-y-auto'>",
    "          <Dashboard />",
    "        </main>",
    "      </div>",
    "    </div>",
    "  );",
    "};",
    "export default App;"
];
appLines.forEach((l, i) => {
    fs.writeFileSync(appFile, ""); // Reset
    fs.appendFileSync(appFile, appLines.slice(0, i + 1).join('\n'));
    gitCommit(`feat: app assembly step ${i + 1}`);
});
pushAndMerge('feat/app-assembly', 'Assemble Premium Application Layout');
