import os
import subprocess
import time

class MicroCommitEngine:
    def __init__(self, workspace_path):
        self.workspace_path = workspace_path
        os.chdir(workspace_path)

    def run_cmd(self, cmd):
        print(f"Running: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error: {result.stderr}")
        return result

    def git_commit(self, message):
        self.run_cmd(["git", "add", "."])
        self.run_cmd(["git", "commit", "-m", message])

    def git_branch(self, name):
        self.run_cmd(["git", "checkout", "-b", name])

    def git_push(self, branch):
        self.run_cmd(["git", "push", "-u", "origin", branch, "--force"])

    def create_and_merge_pr(self, branch, title, body):
        self.git_push(branch)
        time.sleep(2) # Give GitHub a moment
        self.run_cmd(["gh", "pr", "create", "--title", title, "--body", body, "--base", "main", "--head", branch])
        # Auto merge
        self.run_cmd(["gh", "pr", "merge", branch, "--merge", "--auto"])

    def add_file_incrementally(self, file_path, content_lines, branch_name, pr_title):
        self.git_branch(branch_name)
        
        # Create file (1 commit)
        with open(file_path, "w") as f:
            f.write("")
        self.git_commit(f"feat: create {os.path.basename(file_path)}")

        # Add content lines one by one or in small chunks
        for i, line in enumerate(content_lines):
            with open(file_path, "a") as f:
                f.write(line + "\n")
            self.git_commit(f"feat: add line {i+1} to {os.path.basename(file_path)}")

        self.create_and_merge_pr(branch_name, pr_title, f"Incremental implementation of {os.path.basename(file_path)}")
        self.run_cmd(["git", "checkout", "main"])

if __name__ == "__main__":
    engine = MicroCommitEngine(os.getcwd())
    # This is just a tool, I will call it from my thought process or script.
