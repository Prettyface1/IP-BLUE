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
    run(`gh pr create --title "${title}" --body "Advanced Integration: ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

// 1. Stacks Connect Setup
gitBranch('feat/stacks-connect-core');
const stacksFile = 'frontend/src/lib/stacks.ts';
if (!fs.existsSync('frontend/src/lib')) fs.mkdirSync('frontend/src/lib', { recursive: true });
const stacksSteps = [
    "import { AppConfig, UserSession, showConnect } from '@stacks/connect';",
    "import { StacksMainnet, StacksTestnet } from '@stacks/network';",
    "const appConfig = new AppConfig(['store_write', 'publish_data']);",
    "export const userSession = new UserSession({ appConfig });",
    "export const network = new StacksTestnet();",
    "export const authenticate = () => {",
    "  showConnect({",
    "    appDetails: {",
    "      name: 'IP-BLUE',",
    "      icon: window.location.origin + '/logo.png',",
    "    },",
    "    redirectTo: '/',",
    "    onFinish: () => { window.location.reload(); },",
    "    userSession,",
    "  });",
    "};"
];
stacksSteps.forEach((s, i) => {
    fs.appendFileSync(stacksFile, s + '\n');
    gitCommit(`feat: stacks-connect implementation step ${i + 1}`);
});
pushAndMerge('feat/stacks-connect-core', 'Implement Core Stacks Connect Integration');

// 2. WalletConnect Setup
gitBranch('feat/walletconnect-logic');
const wcFile = 'frontend/src/lib/walletconnect.ts';
const wcSteps = [
    "import SignClient from '@walletconnect/sign-client';",
    "export const initWC = async () => {",
    "  const signClient = await SignClient.init({",
    "    projectId: 'YOUR_PROJECT_ID',",
    "    metadata: {",
    "      name: 'IP-BLUE',",
    "      description: 'Integrated Protocol BLUE',",
    "      url: 'https://ip-blue.xyz',",
    "      icons: ['https://walletconnect.com/walletconnect-logo.png']",
    "    }",
    "  });",
    "  return signClient;",
    "};",
    "// Additional WC logic",
    "export const connectWC = async (client) => {",
    "  const { uri, approval } = await client.connect({",
    "    requiredNamespaces: {",
    "      stacks: {",
    "        methods: ['stacks_signTransaction'],",
    "        chains: ['stacks:1', 'stacks:2'],",
    "        events: ['accountsChanged']",
    "      }",
    "    }",
    "  });",
    "  return { uri, approval };",
    "};"
];
wcSteps.forEach((s, i) => {
    fs.appendFileSync(wcFile, s + '\n');
    gitCommit(`feat: walletconnect integration step ${i + 1}`);
});
pushAndMerge('feat/walletconnect-logic', 'Implement WalletConnect Protocol Integration');

// 3. Chainhooks Setup
gitBranch('feat/chainhooks-client');
const chFile = 'frontend/src/lib/chainhooks.ts';
const chSteps = [
    "import { ChainhooksClient } from '@hirosystems/chainhooks-client';",
    "export const setupChainhooks = () => {",
    "  const client = new ChainhooksClient({",
    "    baseUrl: 'https://api.hirosystems.com',",
    "    apiKey: 'YOUR_API_KEY'",
    "  });",
    "  return client;",
    "};",
    "export const listenToIPRegistry = (client) => {",
    "  client.subscribe({",
    "    event: 'contract_call',",
    "    contract: 'ip-blue',",
    "    function: 'register-ip'",
    "  }, (data) => {",
    "    console.log('New IP registered:', data);",
    "  });",
    "};"
];
chSteps.forEach((s, i) => {
    fs.appendFileSync(chFile, s + '\n');
    gitCommit(`feat: chainhooks-client setup step ${i + 1}`);
});
pushAndMerge('feat/chainhooks-client', 'Implement Hiro Chainhooks Client Integration');
