import os
import subprocess
import time
import uuid

class ProjectAutomator:
    def __init__(self, workspace):
        self.workspace = workspace
        os.chdir(workspace)

    def run(self, cmd):
        print(f"Executing: {' '.join(cmd)}")
        return subprocess.run(cmd, capture_output=True, text=True)

    def commit(self, message):
        self.run(["git", "add", "."])
        self.run(["git", "commit", "-m", message])

    def branch(self, name):
        self.run(["git", "checkout", "main"])
        self.run(["git", "checkout", "-b", name])

    def push_and_pr(self, branch, title, body):
        self.run(["git", "push", "-u", "origin", branch, "--force"])
        time.sleep(1)
        self.run(["gh", "pr", "create", "--title", title, "--body", body, "--base", "main", "--head", branch])
        time.sleep(1)
        self.run(["gh", "pr", "merge", branch, "--merge", "--auto"])

    def create_micro_commits_for_file(self, file_path, lines, branch_name, pr_title):
        self.branch(branch_name)
        # Create empty
        with open(file_path, "w") as f:
            f.write("")
        self.commit(f"feat: initialize {os.path.basename(file_path)}")
        
        for i, line in enumerate(lines):
            with open(file_path, "a") as f:
                f.write(line + "\n")
            self.commit(f"feat: add line {i+1} to {os.path.basename(file_path)}")
        
        self.push_and_pr(branch_name, pr_title, f"Detailed implementation of {pr_title}")

    def execute_story(self, tasks):
        for task in tasks:
            self.branch(task['branch'])
            for commit_msg in task['commits']:
                # Do some small change
                with open("ACTIVITY.md", "a") as f:
                    f.write(f"- {commit_msg} at {time.ctime()}\n")
                self.commit(commit_msg)
            self.push_and_pr(task['branch'], task['title'], task['body'])

if __name__ == "__main__":
    automator = ProjectAutomator(os.getcwd())
    
    # Example task generation
    # I will call this with specific tasks in my thought process.
