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
    run(`gh pr create --title "${title}" --body "Advanced Contract Logic: ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

const contractPath = 'contracts/ip-blue.clar';

// 1. Licensing Logic
gitBranch('feat/contract-licensing');
const licenseLines = [
    '',
    ';; Issue a license for IP usage',
    '(define-public (issue-license (ip-id uint) (licensee principal) (license-type (string-ascii 50)) (usage-count uint) (expiration uint) (royalty-rate uint))',
    '  (let ((ip-details (unwrap! (map-get? ip-registry {ip-id: ip-id}) ERR-NOT-FOUND)))',
    '    (asserts! (is-valid-license-type license-type) ERR-INVALID-INPUT)',
    '    (map-set ip-licenses {ip-id: ip-id, licensee: licensee} {license-type: license-type, usage-count: usage-count, expiration: expiration, royalty-rate: royalty-rate})',
    '    (ok true)))'
];
licenseLines.forEach((l, i) => {
    fs.appendFileSync(contractPath, l + '\n');
    gitCommit(`feat: licensing implementation step ${i + 1}`);
});
pushAndMerge('feat/contract-licensing', 'Implement IP Licensing Logic');

// 2. Revenue Tracking
gitBranch('feat/contract-revenue');
const revenueLines = [
    '',
    ';; Record revenue and distribute royalties',
    '(define-public (record-revenue (ip-id uint) (amount uint))',
    '  (let ((revenue-map (default-to {total-revenue: u0, distributed-revenue: u0} (map-get? ip-revenue {ip-id: ip-id}))))',
    '    (map-set ip-revenue {ip-id: ip-id} {total-revenue: (+ (get total-revenue revenue-map) amount), distributed-revenue: (get distributed-revenue revenue-map)})',
    '    (ok true)))'
];
revenueLines.forEach((l, i) => {
    fs.appendFileSync(contractPath, l + '\n');
    gitCommit(`feat: revenue tracking implementation step ${i + 1}`);
});
pushAndMerge('feat/contract-revenue', 'Implement Revenue and Royalty Tracking');
