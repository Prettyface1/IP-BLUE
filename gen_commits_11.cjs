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
    run(`gh pr create --title "${title}" --body "Node.js Backend Implementation: ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

if (!fs.existsSync('backend')) fs.mkdirSync('backend');

// 1. Backend Init
gitBranch('feat/backend-init');
const pkg = {
    name: "ip-blue-backend",
    version: "1.0.0",
    main: "index.js",
    scripts: {
        start: "node index.js",
        dev: "nodemon index.js"
    },
    dependencies: {
        express: "^4.18.2",
        cors: "^2.8.5",
        dotenv: "^16.3.1",
        "@hirosystems/chainhooks-client": "^0.1.0",
        "@stacks/transactions": "^6.10.0"
    }
};
fs.writeFileSync('backend/package.json', JSON.stringify(pkg, null, 2));
gitCommit('feat: initialize backend package.json');
pushAndMerge('feat/backend-init', 'Initialize Node.js Backend');

// 2. Server implementation
gitBranch('feat/backend-server');
const serverLines = [
    "const express = require('express');",
    "const cors = require('cors');",
    "require('dotenv').config();",
    "const app = express();",
    "app.use(cors());",
    "app.use(express.json());",
    "const PORT = process.env.PORT || 3001;",
    "app.get('/health', (req, res) => res.json({ status: 'ok' }));",
    "app.listen(PORT, () => console.log(`Server running on port ${PORT}`));"
];
serverLines.forEach((l, i) => {
    fs.appendFileSync('backend/index.js', l + '\n');
    gitCommit(`feat: server implementation part ${i + 1}`);
});
pushAndMerge('feat/backend-server', 'Implement Express Server for IP-BLUE');
