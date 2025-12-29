import os
import subprocess
import time

def run(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True)

def git_commit(msg):
    run("git add .")
    run(f'git commit -m "{msg}"')

def git_branch(name):
    run("git checkout main")
    run(f"git checkout -b {name}")

def push_and_merge(branch, title):
    run(f"git push -u origin {branch} --force")
    time.sleep(2)
    run(f'gh pr create --title "{title}" --body "Automated PR for {title}" --base main --head {branch}')
    time.sleep(2)
    run(f"gh pr merge {branch} --merge --auto")

# 1. Branch: feat/contract-constants
git_branch("feat/contract-constants")
with open("contracts/ip-blue.clar", "w") as f:
    f.write(";; IP-BLUE: Integrated Protocol BLUE\n")
git_commit("docs: add contract header")
constants = [
    "(define-constant CONTRACT-OWNER tx-sender)",
    "(define-constant ERR-UNAUTHORIZED (err u100))",
    "(define-constant ERR-INVALID-IP (err u101))",
    "(define-constant ERR-ALREADY-EXISTS (err u102))",
    "(define-constant ERR-NOT-FOUND (err u103))",
    "(define-constant ERR-INSUFFICIENT-BALANCE (err u104))",
    "(define-constant ERR-INVALID-INPUT (err u105))"
]
for i, c in enumerate(constants):
    with open("contracts/ip-blue.clar", "a") as f:
        f.write(c + "\n")
    git_commit(f"feat: add constant {i+1}")
push_and_merge("feat/contract-constants", "Implement Core Constants for IP-BLUE")

# 2. Branch: feat/contract-validation
git_branch("feat/contract-validation")
validations = [
    "(define-private (is-valid-title (title (string-ascii 100))) (and (> (len title) u0) (<= (len title) u100)))",
    "(define-private (is-valid-description (description (string-ascii 500))) (and (> (len description) u0) (<= (len description) u500)))",
    "(define-private (is-valid-base-price (base-price uint)) (> base-price u0))",
    "(define-private (is-valid-license-type (license-type (string-ascii 50))) (and (> (len license-type) u0) (<= (len license-type) u50)))",
    "(define-private (is-valid-ip-id (ip-id uint)) (> ip-id u0))"
]
for i, v in enumerate(validations):
    with open("contracts/ip-blue.clar", "a") as f:
        f.write(v + "\n")
    git_commit(f"feat: add validation logic part {i+1}")
push_and_merge("feat/contract-validation", "Implement Input Validation Logic")

# 3. Branch: feat/contract-storage
git_branch("feat/contract-storage")
maps = [
    "(define-map ip-registry {ip-id: uint} {creator: principal, title: (string-ascii 100), description: (string-ascii 500), total-shares: uint, base-price: uint, license-type: (string-ascii 50)})",
    "(define-map ip-ownership {ip-id: uint, owner: principal} {shares: uint})",
    "(define-map ip-licenses {ip-id: uint, licensee: principal} {license-type: (string-ascii 50), usage-count: uint, expiration: uint, royalty-rate: uint})",
    "(define-map ip-revenue {ip-id: uint} {total-revenue: uint, distributed-revenue: uint})"
]
for i, m in enumerate(maps):
    with open("contracts/ip-blue.clar", "a") as f:
        f.write(m + "\n")
    git_commit(f"feat: define storage map {i+1}")
push_and_merge("feat/contract-storage", "Define Contract Storage Maps")

# 4. Branch: feat/contract-vars
git_branch("feat/contract-vars")
with open("contracts/ip-blue.clar", "a") as f:
    f.write("(define-data-var next-ip-id uint u1)\n")
git_commit("feat: initialize next-ip-id variable")
push_and_merge("feat/contract-vars", "Initialize Contract Variables")
