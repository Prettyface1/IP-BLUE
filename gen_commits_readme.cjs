const { execSync } = require('child_process');
const fs = require('fs');

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
    run(`gh pr create --title "${title}" --body "Premium README Enhancement" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

gitBranch('feat/premium-readme');

const content = `# 🛡️ IP-BLUE | Integrated Protocol BLUE

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Stacks](https://img.shields.io/badge/Blockchain-Stacks-8A2BE2)
![Vite](https://img.shields.io/badge/Frontend-Vite-646CFF)

**IP-BLUE** is a next-generation Intellectual Property management protocol designed for the decentralized web. It enables creators to register, license, and monetize their IP with surgical precision on the Stacks blockchain.

---

## 🚀 Key Features

- **Decentralized Registry**: Immutable proof of creation and ownership.
- **Fractional Ownership**: Trade and manage shares of IP assets.
- **Smart Licensing**: Automated royalty distribution via Clarity 4 contracts.
- **Web3 Integrations**: Multi-wallet support (Leather, Xverse, WalletConnect).
- **Real-time Monitoring**: Indexing powered by Hiro Chainhooks.

## 🛠 Tech Stack

### Smart Contracts
- **Language**: Clarity 4 (Epoch 3.3)
- **Framework**: Clarinet
- **Key Modules**: \`ip-blue.clar\` (Registry & Royalties)

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Vanilla CSS + Tailwind
- **Animations**: Framer Motion
- **Icons**: Lucide-React

## 📦 Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Prettyface1/IP-BLUE.git
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start Dev Server**
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`

---

Built with ❤️ for the Stacks Ecosystem.
`;

fs.writeFileSync('README.md', "");
const lines = content.split('\n');
lines.forEach((l, i) => {
    fs.appendFileSync('README.md', l + '\n');
    gitCommit(`docs: premium landing page update step ${i + 1}`);
});

pushAndMerge('feat/premium-readme', 'Enhance Project Documentation with Premium Styling');
