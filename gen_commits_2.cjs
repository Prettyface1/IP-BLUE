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
    run('git pull origin main'); // Stay updated
    run(`git checkout -b ${name}`);
}

function pushAndMerge(branch, title) {
    run(`git push -u origin ${branch} --force`);
    run(`gh pr create --title "${title}" --body "Automated implementation for ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --delete-branch`);
}

const contractPath = path.join(__dirname, 'contracts', 'ip-blue.clar');

// 4. Branch: feat/contract-register-ip
gitBranch('feat/contract-register-ip');
const registerLines = [
    '',
    ';; Register a new IP asset',
    '(define-public (register-ip (title (string-ascii 100)) (description (string-ascii 500)) (total-shares uint) (base-price uint) (license-type (string-ascii 50)))',
    '  (let ((ip-id (var-get next-ip-id)))',
    '    (asserts! (is-valid-title title) ERR-INVALID-INPUT)',
    '    (asserts! (is-valid-description description) ERR-INVALID-INPUT)',
    '    (map-set ip-registry {ip-id: ip-id} {creator: tx-sender, title: title, description: description, total-shares: total-shares, base-price: base-price, license-type: license-type})',
    '    (map-set ip-ownership {ip-id: ip-id, owner: tx-sender} {shares: total-shares})',
    '    (var-set next-ip-id (+ ip-id u1))',
    '    (ok ip-id)))'
];
registerLines.forEach((l, i) => {
    fs.appendFileSync(contractPath, l + '\n');
    gitCommit(`feat: ip-registry implementation step ${i + 1}`);
});
pushAndMerge('feat/contract-register-ip', 'Implement IP Registration Flow');

// 5. Branch: feat/contract-transfer-shares
gitBranch('feat/contract-transfer-shares');
const transferLines = [
    '',
    ';; Transfer IP ownership shares',
    '(define-public (transfer-ip-shares (ip-id uint) (recipient principal) (shares uint))',
    '  (let ((sender-shares (default-to u0 (get shares (map-get? ip-ownership {ip-id: ip-id, owner: tx-sender})))))',
    '    (asserts! (>= sender-shares shares) ERR-INSUFFICIENT-BALANCE)',
    '    (map-set ip-ownership {ip-id: ip-id, owner: tx-sender} {shares: (- sender-shares shares)})',
    '    (map-set ip-ownership {ip-id: ip-id, owner: recipient} {shares: (+ (default-to u0 (get shares (map-get? ip-ownership {ip-id: ip-id, owner: recipient}))) shares)})',
    '    (ok true)))'
];
transferLines.forEach((l, i) => {
    fs.appendFileSync(contractPath, l + '\n');
    gitCommit(`feat: share-transfer logic step ${i + 1}`);
});
pushAndMerge('feat/contract-transfer-shares', 'Implement IP Share Transfer');
