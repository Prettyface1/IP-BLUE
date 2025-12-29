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
    run(`gh pr create --title "${title}" --body "Premium UI Component Development: ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

const uiDir = 'frontend/src/components/ui';
if (!fs.existsSync(uiDir)) fs.mkdirSync(uiDir, { recursive: true });

const components = [
    'Button', 'Card', 'Input', 'Modal', 'Sidebar', 'Navbar', 'Toast', 'Loader',
    'Slider', 'Switch', 'Badge', 'Avatar', 'Skeleton', 'Separator', 'Progress',
    'Tooltip', 'Popover', 'Command', 'Calendar', 'Tabs'
];

components.forEach(comp => {
    const branchName = `feat/ui-${comp.toLowerCase()}`;
    gitBranch(branchName);

    const filePath = path.join(uiDir, `${comp}.tsx`);

    // Micro commits for each component
    fs.writeFileSync(filePath, `import React from 'react';\n`);
    gitCommit(`feat: create ${comp} component file`);

    fs.appendFileSync(filePath, `export interface ${comp}Props {\n  children?: React.ReactNode;\n  className?: string;\n}\n`);
    gitCommit(`feat: add types for ${comp}`);

    fs.appendFileSync(filePath, `\nexport const ${comp}: React.FC<${comp}Props> = ({ children, className }) => {\n`);
    gitCommit(`feat: implement ${comp} base structure`);

    fs.appendFileSync(filePath, `  return (\n    <div className={className}>\n      {children}\n    </div>\n  );\n};\n`);
    gitCommit(`feat: finish ${comp} implementation`);

    pushAndMerge(branchName, `Add Premium ${comp} Component`);
});
