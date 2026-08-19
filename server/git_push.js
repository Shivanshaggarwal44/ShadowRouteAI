const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..'); // project root: c:\Users\Gaurav Aggarwal\OneDrive\Documents\hackathon safety prompt verse
const remoteUrl = 'https://github.com/Shivanshaggarwal44/ShadowRoute-AI-.git';
const token = process.env.GITHUB_TOKEN || process.argv[2];

async function run() {
  console.log('Project directory:', repoDir);
  console.log('Target Remote URL:', remoteUrl);

  try {
    await git.init({ fs, dir: repoDir, defaultBranch: 'main' });
    
    try {
      await git.addRemote({ fs, dir: repoDir, remote: 'origin', url: remoteUrl, force: true });
    } catch (e) {
      // ignore if exists
    }

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

    console.log('Pushing to main branch...');
    const pushResult = await git.push({
      fs,
      http,
      dir: repoDir,
      remote: 'origin',
      ref: 'main',
      force: true,
      onAuth: () => ({
        username: token || 'Shivanshaggarwal44',
        password: token || ''
      })
    });
    console.log('✓ Successfully pushed to GitHub main branch!', pushResult);
  } catch (err) {
    if (err.data && err.data.statusCode === 401) {
      console.log('AUTH_REQUIRED: GitHub Personal Access Token is needed for remote write access.');
    } else {
      console.error('Git execution error:', err.message);
    }
  }
}

run();
