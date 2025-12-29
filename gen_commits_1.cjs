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
    run(`git checkout -b ${name}`);
}

function pushAndMerge(branch, title) {
    run(`git push -u origin ${branch} --force`);
    run(`gh pr create --title "${title}" --body "Automated PR for ${title}" --base main --head ${branch}`);
    run(`gh pr merge ${branch} --merge --auto`);
}

const contractPath = path.join(__dirname, 'contracts', 'ip-blue.clar');

// 1. Branch: feat/contract-constants
gitBranch('feat/contract-constants');
fs.writeFileSync(contractPath, ';; IP-BLUE: Integrated Protocol BLUE\n');
gitCommit('docs: add contract header');
const constants = [
    '(define-constant CONTRACT-OWNER tx-sender)',
    '(define-constant ERR-UNAUTHORIZED (err u100))',
    '(define-constant ERR-INVALID-IP (err u101))',
    '(define-constant ERR-ALREADY-EXISTS (err u102))',
    '(define-constant ERR-NOT-FOUND (err u103))',
    '(define-constant ERR-INSUFFICIENT-BALANCE (err u104))',
    '(define-constant ERR-INVALID-INPUT (err u105))'
];
constants.forEach((c, i) => {
    fs.appendFileSync(contractPath, c + '\n');
    gitCommit(`feat: add constant ${i + 1}`);
});
pushAndMerge('feat/contract-constants', 'Implement Core Constants for IP-BLUE');

// 2. Branch: feat/contract-validation
gitBranch('feat/contract-validation');
const validations = [
    '(define-private (is-valid-title (title (string-ascii 100))) (and (> (len title) u0) (<= (len title) u100)))',
    '(define-private (is-valid-description (description (string-ascii 500))) (and (> (len description) u0) (<= (len description) u500)))',
    '(define-private (is-valid-base-price (base-price uint)) (> base-price u0))',
    '(define-private (is-valid-license-type (license-type (string-ascii 50))) (and (> (len license-type) u0) (<= (len license-type) u50)))',
    '(define-private (is-valid-ip-id (ip-id uint)) (> ip-id u0))'
];
validations.forEach((v, i) => {
    fs.appendFileSync(contractPath, v + '\n');
    gitCommit(`feat: add validation logic part ${i + 1}`);
});
pushAndMerge('feat/contract-validation', 'Implement Input Validation Logic');

// 3. Branch: feat/contract-storage
gitBranch('feat/contract-storage');
const maps = [
    '(define-map ip-registry {ip-id: uint} {creator: principal, title: (string-ascii 100), description: (string-ascii 500), total-shares: uint, base-price: uint, license-type: (string-ascii 50)})',
    '(define-map ip-ownership {ip-id: uint, owner: principal} {shares: uint})',
    '(define-map ip-licenses {ip-id: uint, licensee: principal} {license-type: (string-ascii 50), usage-count: uint, expiration: uint, royalty-rate: uint})',
    '(define-map ip-revenue {ip-id: uint} {total-revenue: uint, distributed-revenue: uint})'
];
maps.forEach((m, i) => {
    fs.appendFileSync(contractPath, m + '\n');
    gitCommit(`feat: define storage map ${i + 1}`);
});
pushAndMerge('feat/contract-storage', 'Define Contract Storage Maps');
