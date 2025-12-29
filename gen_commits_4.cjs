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
    run(`gh pr create --title "${title}" --body "Automated documentation/feature for ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

// 9. Branch: docs/project-overview
gitBranch('docs/project-overview');
fs.writeFileSync('README.md', '# IP-BLUE: Integrated Protocol BLUE\n\n## Overview\nIP-BLUE is a premium intellectual property management protocol built on the Stacks blockchain.\n');
gitCommit('docs: add project overview');
pushAndMerge('docs/project-overview', 'Add Project Overview Documentation');

// 10. Branch: docs/architecture
gitBranch('docs/architecture');
fs.appendFileSync('README.md', '\n## Architecture\nThe project follows a modular architecture with a Clarity smart contract core and a React-based premium frontend.\n');
gitCommit('docs: add architecture section');
pushAndMerge('docs/architecture', 'Add Architecture Section to README');

// 11. Branch: docs/tech-stack
gitBranch('docs/tech-stack');
fs.appendFileSync('README.md', '\n## Tech Stack\n- **Blockchain**: Stacks (Clarity 4, Epoch 3.3)\n- **Frontend**: React, Vite, TailwindCSS\n- **Wallets**: @stacks/connect, WalletConnect\n- **Indexing**: @hirosystems/chainhooks-client\n');
gitCommit('docs: list tech stack');
pushAndMerge('docs/tech-stack', 'Document Project Tech Stack');

// 12. Branch: feat/contract-royalty-calc
gitBranch('feat/contract-royalty-calc');
const calcLines = [
    '',
    ';; Calculate royalty amount',
    '(define-read-only (get-royalty-amount (ip-id uint) (base-price uint))',
    '  (let ((ip-details (unwrap! (map-get? ip-registry {ip-id: ip-id}) (ok u0))))',
    '    (ok (/ (* base-price u5) u100)))) ;; Default 5% royalty'
];
const contractPath = 'contracts/ip-blue.clar';
calcLines.forEach((l, i) => {
    fs.appendFileSync(contractPath, l + '\n');
    gitCommit(`feat: royalty calculation step ${i + 1}`);
});
pushAndMerge('feat/contract-royalty-calc', 'Implement Royalty Calculation Logic');
