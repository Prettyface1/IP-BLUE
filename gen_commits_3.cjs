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
    run(`gh pr create --title "${title}" --body "Automated setup for ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

if (!fs.existsSync('frontend')) fs.mkdirSync('frontend');

// 6. Branch: feat/frontend-pkg
gitBranch('feat/frontend-pkg');
const pkg = {
    name: "ip-blue-frontend",
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview"
    },
    dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "@stacks/connect": "^22.0.0",
        "@stacks/transactions": "^6.10.0",
        "@walletconnect/sign-client": "^2.11.0",
        "@hirosystems/chainhooks-client": "^0.1.0",
        "lucide-react": "^0.344.0",
        "framer-motion": "^11.0.8"
    },
    devDependencies: {
        "@types/react": "^18.2.56",
        "@types/react-dom": "^18.2.19",
        "@vitejs/plugin-react": "^4.2.1",
        "typescript": "^5.2.2",
        "vite": "^5.1.4",
        "autoprefixer": "^10.4.18",
        "postcss": "^8.4.35",
        "tailwindcss": "^3.4.1"
    }
};
fs.writeFileSync('frontend/package.json', JSON.stringify(pkg, null, 2));
gitCommit('feat: add frontend package.json');
pushAndMerge('feat/frontend-pkg', 'Initialize Frontend Package Configuration');

// 7. Branch: feat/design-tokens-colors
gitBranch('feat/design-tokens-colors');
if (!fs.existsSync('frontend/src')) fs.mkdirSync('frontend/src');
const cssContent = `@layer base {
  :root {
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}`;
fs.writeFileSync('frontend/src/index.css', cssContent);
gitCommit('feat: add fundamental design color tokens');
pushAndMerge('feat/design-tokens-colors', 'Implement Core Design System Colors');

// 8. Branch: feat/frontend-vite-config
gitBranch('feat/frontend-vite-config');
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;
fs.writeFileSync('frontend/vite.config.ts', viteConfig);
gitCommit('feat: configure vite for react');
pushAndMerge('feat/frontend-vite-config', 'Configure Vite for React Implementation');
