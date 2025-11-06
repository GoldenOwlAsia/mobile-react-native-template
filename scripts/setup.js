#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

(async () => {
  // Step 0️⃣ — Load dependencies
  const inquirer = (await import('inquirer')).default;
  const chalk = (await import('chalk')).default;

  console.log(chalk.cyan.bold('\n🛠️  React Native Template Setup\n'));

  // Step 1️⃣ — Ask for app name and organization
  const { appName, organization } = await inquirer.prompt([
    {
      name: 'appName',
      message: 'App name (JS):',
      default: 'myapp',
      validate: input => input.trim().length > 0 || 'App name cannot be empty.',
    },
    {
      name: 'organization',
      message: "Organization's name (optional):",
      default: '',
    },
  ]);

  const safeAppName = appName.trim().toLowerCase().replace(/\s+/g, '');
  const safeOrganization = organization
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
  const safeAppId =
    'com' +
    (safeOrganization ? `.${safeOrganization}` : '') +
    `.${safeAppName}`;
  const formattedAppName = appName
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');

  // Step 2️⃣ — Ask for bundle IDs (optional override)
  const { inputBundleId, inputPackageName } = await inquirer.prompt([
    {
      name: 'inputBundleId',
      message: `iOS Bundle ID (leave empty to use default ${safeAppId}):`,
      default: '',
    },
    {
      name: 'inputPackageName',
      message: `Android Package Name (leave empty to use default ${safeAppId}):`,
      default: '',
    },
  ]);

  const bundleId = inputBundleId.trim() || safeAppId;
  const packageName = inputPackageName.trim() || safeAppId;

  console.log(chalk.green.bold('\n📦 Configuration Summary:'));
  console.log(`  ${chalk.yellow('Input App Name:')} ${appName}`);
  console.log(`  ${chalk.yellow('Formatted Name:')} ${formattedAppName}`);
  console.log(`  ${chalk.yellow('iOS Bundle ID:')} ${bundleId}`);
  console.log(`  ${chalk.yellow('Android Package:')} ${packageName}`);

  // Step 3️⃣ — Run react-native-rename
  let renameCmd = `npx react-native-rename "${formattedAppName}"`;
  if (bundleId === packageName) {
    renameCmd += ` -b "${bundleId}"`;
  } else {
    renameCmd += ` --iosBundleID "${bundleId}" --androidBundleID "${packageName}"`;
  }

  console.log(chalk.cyan(`\n⚙️  Running rename command:`));
  console.log(chalk.gray(`   ${renameCmd}\n`));

  try {
    execSync(renameCmd, { stdio: 'inherit' });
    console.log(chalk.green('\n✅ Rename completed successfully.'));
  } catch (e) {
    console.warn(
      chalk.red(
        '\n⚠️  react-native-rename failed. Try running manually:\n' +
          `   ${renameCmd}\n`,
      ),
    );
  }

  // Step 4️⃣ — Optionally reset git
  const { resetGit } = await inquirer.prompt([
    {
      name: 'resetGit',
      type: 'confirm',
      message: 'Reset git history (delete .git and init new repo)?',
      default: true,
    },
  ]);
  if (resetGit) {
    try {
      console.log(chalk.cyan('\n♻️  Resetting git history...'));
      if (fs.existsSync(path.join(root, '.git'))) {
        fs.rmSync(path.join(root, '.git'), { recursive: true, force: true });
      }
      execSync('git init', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Initial commit from template"', {
        stdio: 'inherit',
      });
      console.log(chalk.green('✅ Git reset complete.'));
    } catch (e) {
      console.warn(chalk.red('⚠️  Failed to reset git:'), e.message);
    }
  }

  // Done
  console.log(chalk.magenta('\n─────────────────────────────'));
  console.log(chalk.green.bold('🎉 Setup complete!'));
  console.log(chalk.yellow(`📱 App: ${formattedAppName}`));
  console.log(chalk.yellow(`🍏 iOS Bundle ID: ${bundleId}`));
  console.log(chalk.yellow(`🤖 Android Package: ${packageName}`));
  console.log(chalk.magenta('─────────────────────────────\n'));
  console.log(chalk.gray('Next steps:'));
  console.log(chalk.gray('  1️⃣  yarn'));
  console.log(chalk.gray('  2️⃣  watchman watch-del-all'));
  console.log(chalk.gray('  3️⃣  run pod install (iOS only)'));
  console.log(chalk.gray('  4️⃣  yarn android or yarn ios'));
  console.log(chalk.magenta('\nHappy Coding! 💪'));
})();
