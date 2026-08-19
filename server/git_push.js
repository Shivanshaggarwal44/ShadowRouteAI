const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..'); // project root: c:\Users\Gaurav Aggarwal\OneDrive\Documents\hackathon safety prompt verse
const remoteUrl = 'https://github.com/Shivanshaggarwal44/ShadowRoute-AI-.git';

async function run() {
  console.log('Project directory:', repoDir);
  console.log('Target Remote URL:', remoteUrl);

  try {
    // 1. Init git repo if needed
    await git.init({ fs, dir: repoDir, defaultBranch: 'main' });
    console.log('Git initialized.');

    // 2. Add remote origin
    try {
      await git.addRemote({ fs, dir: repoDir, remote: 'origin', url: remoteUrl, force: true });
    } catch (e) {
      console.log('Remote note:', e.message);
    }

    // 3. Stage all files recursively except node_modules, dist, .git
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
    console.log('Files staged successfully.');

    // 4. Commit
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

    // 5. Push to main
    console.log('Pushing to main branch...');
    const pushResult = await git.push({
      fs,
      http,
      dir: repoDir,
      remote: 'origin',
      ref: 'main',
      force: true
    });
    console.log('Push Result:', pushResult);
  } catch (err) {
    console.error('Git execution error:', err);
  }
}

run();
