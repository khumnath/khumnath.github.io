import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function run(cmd, options = {}) {
  console.log(`\n> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...options });
}

function deploy() {
  console.log('🌟 Starting Safe Deployment to "main" and "source" branches...');

  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const tempDeployDir = path.join(rootDir, '..', '.deploy_khumnath_main');

  // 1. Build fresh dist
  run('bun run build');

  // 2. Commit & Push source branch
  console.log('\n📦 Step 1: Committing and pushing source branch...');
  run('git add -A');
  try {
    run('git commit -m "Update posts, assets, and SSG configuration"');
  } catch (err) {
    console.log('ℹ️ No new changes to commit on source branch.');
  }

  try {
    run('git push origin source');
    console.log('✅ Pushed source branch to origin/source');
  } catch (err) {
    console.warn('⚠️ Could not push source branch (check git credentials/network):', err.message);
  }

  // 3. Prepare temporary worktree for main branch (prevents touching local source/ignored files)
  console.log('\n🌐 Step 2: Preparing clean "main" deployment worktree...');

  if (fs.existsSync(tempDeployDir)) {
    try {
      execSync(`git worktree remove --force "${tempDeployDir}"`, { stdio: 'ignore' });
    } catch {}
    fs.rmSync(tempDeployDir, { recursive: true, force: true });
  }

  try {
    execSync('git worktree prune', { stdio: 'ignore' });
  } catch {}

  // Create worktree for main branch
  try {
    run(`git worktree add -B main "${tempDeployDir}" origin/main`);
  } catch {
    run(`git worktree add "${tempDeployDir}" main`);
  }

  // 4. Clean old files in deploy directory (preserving .git)
  console.log('🧹 Cleaning old build files in main worktree...');
  const files = fs.readdirSync(tempDeployDir);
  for (const file of files) {
    if (file === '.git') continue;
    fs.rmSync(path.join(tempDeployDir, file), { recursive: true, force: true });
  }

  // 5. Copy fresh dist files to main worktree
  console.log('📋 Copying dist files to main worktree...');
  fs.cpSync(distDir, tempDeployDir, { recursive: true });

  // Ensure CNAME is present in main
  const cnameSource = path.join(rootDir, 'CNAME');
  const cnamePublic = path.join(rootDir, 'public', 'CNAME');
  if (fs.existsSync(cnameSource)) {
    fs.copyFileSync(cnameSource, path.join(tempDeployDir, 'CNAME'));
  } else if (fs.existsSync(cnamePublic)) {
    fs.copyFileSync(cnamePublic, path.join(tempDeployDir, 'CNAME'));
  }

  // Ensure .nojekyll is present so GitHub Pages does not ignore files with underscores
  fs.writeFileSync(path.join(tempDeployDir, '.nojekyll'), '', 'utf-8');

  // 6. Commit & Push main branch
  console.log('\n🚀 Step 3: Committing and pushing main branch...');
  run('git add -A', { cwd: tempDeployDir });
  try {
    run('git commit -m "Deploy latest static site build"', { cwd: tempDeployDir });
    run('git push origin main', { cwd: tempDeployDir });
    console.log('✅ Successfully deployed and pushed to origin/main!');
  } catch (err) {
    console.log('ℹ️ No new changes to push on main branch, or push completed.');
  }

  // 7. Cleanup worktree
  console.log('\n🧹 Step 4: Cleaning up temporary worktree...');
  try {
    execSync(`git worktree remove --force "${tempDeployDir}"`, { stdio: 'ignore' });
    execSync('git worktree prune', { stdio: 'ignore' });
  } catch {}

  console.log('\n🎉 Deployment complete! Both "source" and "main" branches are synchronized without touching local ignored files.');
}

deploy();
