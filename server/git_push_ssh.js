const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoDir = path.resolve(__dirname, '..');
const sshUrl = 'git@ssh.github.com:Shivanshaggarwal44/ShadowRoute-AI-.git';

async function run() {
  console.log('Repo Dir:', repoDir);
  console.log('Target SSH URL:', sshUrl);

  try {
    await git.init({ fs, dir: repoDir, defaultBranch: 'main' });

    try {
      await git.addRemote({ fs, dir: repoDir, remote: 'origin', url: sshUrl, force: true });
    } catch (e) {}

    // Stage files
    async function stageDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(repoDir, fullPath).replace(/\\/g, '/');

        if (relPath.startsWith('.git') || relPath.includes('node_modules') || relPath.includes('dist') || relPath.includes('.system_generated')) {
          continue;
        }

        if (entry.isDirectory()) {
          await stageDir(fullPath);
        } else if (entry.isFile()) {
          await git.add({ fs, dir: repoDir, filepath: relPath });
        }
      }
    }

    console.log('Staging files...');
    await stageDir(repoDir);

    const sha = await git.commit({
      fs,
      dir: repoDir,
      author: {
        name: 'Shivansh Aggarwal',
        email: 'shivansh@shadowroute.ai',
      },
      message: 'feat: ShadowRoute AI upgraded MapLibre GL JS & Live GPS Navigation MVP'
    });
    console.log('Committed SHA:', sha);

  } catch (err) {
    console.error('Error during commit:', err.message);
  }
}

run();
