#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

const SETUP_DATA = {
  appName: {
    field: 'appName',
    describe: 'App name (JS)',
    argAlias: 'n',
  },
  organization: {
    field: 'organization',
    describe: "Organization's name",
    argAlias: 'o',
  },
  bundleId: {
    field: 'bundleId',
    describe: 'iOS Bundle ID',
    argAlias: 'i',
  },
  packageName: {
    field: 'packageName',
    describe: 'Android package name',
    argAlias: 'a',
  },
  resetGit: {
    field: 'resetGit',
    describe: 'Reset git history',
    argAlias: undefined,
  },
};

const fail = (msg, code = 1) => {
  if (msg) console.error(msg);
  process.exit(code);
};

// 🧩 Handle Ctrl + C gracefully (even before inquirer is loaded)
process.on('SIGINT', () => {
  console.log('\n🛑 Setup interrupted.\n');
  process.exit(0);
});

const setupAppNameAndIds = async () => {
  // Step 0️⃣ — Load dependencies
  const [{ default: chalk }, { default: yargs }, { hideBin }] =
    await Promise.all([
      import('chalk'),
      import('yargs'),
      import('yargs/helpers'),
    ]);

  console.log(chalk.cyan.bold('\n🛠️  React Native Template Setup\n'));

  // Step 1️⃣ - Parse CLI args
  const args = yargs(hideBin(process.argv))
    .option(SETUP_DATA.appName.field, {
      alias: SETUP_DATA.appName.argAlias,
      type: 'string',
      describe: SETUP_DATA.appName.describe,
    })
    .option(SETUP_DATA.organization.field, {
      alias: SETUP_DATA.organization.argAlias,
      type: 'string',
      describe: SETUP_DATA.organization.describe,
    })
    .option(SETUP_DATA.bundleId.field, {
      alias: SETUP_DATA.bundleId.argAlias,
      type: 'string',
      describe: SETUP_DATA.bundleId.describe,
    })
    .option(SETUP_DATA.packageName.field, {
      alias: SETUP_DATA.packageName.argAlias,
      type: 'string',
      describe: SETUP_DATA.packageName.describe,
    })
    .option(SETUP_DATA.resetGit.field, {
      type: 'boolean',
      describe: SETUP_DATA.resetGit.describe,
      default: false,
    })
    .option('autoDefault', {
      type: 'boolean',
      describe: 'Auto accept all defaults (non-interactive)',
      default: false,
    })
    .strict()
    .parse();

  //* Step 1️⃣ additional - Load inquirer if need
  const autoDefault = args.autoDefault ?? false;
  let inquirer = undefined;
  if (autoDefault) {
    console.log(chalk.gray('\n💡 Ran in non-interactive mode (all defaults).'));
  } else {
    inquirer = (await import('inquirer')).default;
  }

  // Step 2️⃣ — Ask for app name and organization if need and validate
  //* 2.1 - app name
  let appName = (args.appName || '').trim();
  if (!appName) {
    const defaultAppName = 'myapp';
    if (autoDefault) {
      appName = defaultAppName;
    } else if (inquirer) {
      appName = (
        await inquirer.prompt([
          {
            name: SETUP_DATA.appName.field,
            message: SETUP_DATA.appName.describe + ':',
            default: defaultAppName,
          },
        ])
      )[SETUP_DATA.appName.field];
    }
  }
  const namePattern = /^[A-Za-z][A-Za-z0-9 _]*$/;
  if (!appName || !namePattern.test(appName.trim())) {
    fail(
      chalk.red(
        `\n❌ Invalid app name: "${appName}".\n` +
          'App name must:\n' +
          '  • Not empty\n' +
          '  • Not start with a number\n' +
          '  • Contain only letters, numbers, spaces, or underscores\n',
      ),
    );
  }

  //* 2.2 organization
  let organization = (args.organization || '').trim();
  if (!organization && inquirer) {
    organization = (
      await inquirer.prompt([
        {
          name: SETUP_DATA.organization.field,
          message: SETUP_DATA.organization.describe + ' (optional):',
          default: '',
        },
      ])
    )[SETUP_DATA.organization.field];
  }

  // Step 3️⃣ — Compute safe app name and app id
  const displayName = appName.trim(); // for app.json
  const formattedAppName = displayName
    .split(/[\s_]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
  const safeAppName = displayName.replace(/[\s_]+/g, '').toLowerCase();
  const safeOrganization = organization
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const defaultId =
    'com' +
    (safeOrganization ? `.${safeOrganization}` : '') +
    `.${safeAppName}`;

  // Step 4️⃣ — Ask for bundle ID and package name (optional override) and validate
  const validateId = (id, name) => {
    const idPattern = /^[a-zA-Z][a-zA-Z0-9_.]*[a-zA-Z0-9]$/;
    if (!idPattern.test(id)) {
      console.error(
        chalk.red(
          `\n❌ Invalid ${name}.\n` +
            `${name} must:\n` +
            '  • Start with a letter\n' +
            '  • Contain only letters, numbers, underscores, or dots\n' +
            '  • Not end with a dot or underscore\n',
        ),
      );
      return false;
    }
    return true;
  };

  //* 4.1 - Bundle ID
  let bundleId = (args.bundleId || '').trim();
  const noteSuffix = chalk.gray(`(leave empty to use default ${defaultId})`);
  if (!bundleId && inquirer) {
    bundleId = (
      await inquirer.prompt([
        {
          name: SETUP_DATA.bundleId.field,
          message: `${SETUP_DATA.bundleId.describe} ${noteSuffix}:`,
          default: '',
        },
      ])
    )[SETUP_DATA.bundleId.field];
  }
  bundleId = bundleId || defaultId;
  if (!validateId(bundleId)) fail(undefined, 2);

  //* 4.2 - Package name
  let packageName = (args.packageName || '').trim();
  if (!packageName && inquirer) {
    packageName = (
      await inquirer.prompt([
        {
          name: SETUP_DATA.packageName.field,
          message: `${SETUP_DATA.packageName.describe} ${noteSuffix}:`,
          default: '',
        },
      ])
    )[SETUP_DATA.packageName.field];
  }
  packageName = packageName || defaultId;
  if (!validateId(packageName)) fail(undefined, 3);

  // Step 5️⃣ — Summarize input
  console.log(chalk.green.bold('\n📦 Configuration Summary:'));
  console.log(`  ${chalk.yellow('Display Name:')} ${displayName}`);
  console.log(`  ${chalk.yellow('Formatted Name:')} ${formattedAppName}`);
  console.log(`  ${chalk.yellow('iOS Bundle ID:')} ${bundleId}`);
  console.log(`  ${chalk.yellow('Android Package:')} ${packageName}`);

  // Step 6️⃣ — Run react-native-rename
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

  // Step 7️⃣ — Update app.json displayName
  const appJsonPath = path.join(root, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    try {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
      if (appJson.displayName !== displayName) {
        appJson.displayName = displayName;
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
        console.log(chalk.green('✅ app.json displayName updated.'));
      }
    } catch (e) {
      console.warn(chalk.red('⚠️  Failed to update app.json:'), e.message);
    }
  }

  // Step 8️⃣ — Optional git reset
  let resetGit = args.resetGit;
  if (typeof resetGit !== 'boolean' && inquirer) {
    resetGit = (
      await inquirer.prompt([
        {
          name: SETUP_DATA.resetGit.field,
          type: 'confirm',
          message:
            SETUP_DATA.resetGit.describe + ' (delete .git and init new repo)?',
          default: true,
        },
      ])
    )[SETUP_DATA.resetGit.field];
  }
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

  // Step 9️⃣ — Wrap up
  console.log(chalk.magenta('\n─────────────────────────────'));
  console.log(chalk.green.bold('🎉 Setup complete!'));
  console.log(chalk.yellow(`📱 App: ${formattedAppName}`));
  console.log(chalk.yellow(`🍏 iOS Bundle ID: ${bundleId}`));
  console.log(chalk.yellow(`🤖 Android Package: ${packageName}`));
  console.log(chalk.magenta('─────────────────────────────'));
  console.log(chalk.gray('Next steps:'));
  console.log(chalk.gray('  1️⃣  yarn'));
  console.log(chalk.yellow('  2️⃣  watchman watch-del-all'));
  console.log(chalk.yellow('  3️⃣  run pod install (iOS only)'));
  console.log(chalk.gray('  4️⃣  yarn android or yarn ios'));
  console.log(chalk.magenta('─────────────────────────────'));
  console.log(chalk.magenta('Happy Coding! 💪'));
  console.log(chalk.magenta('─────────────────────────────'));
};

async () => {
  try {
    await setupAppNameAndIds();
  } catch (e) {
    if (e?.name === 'ExitPromptError') {
      console.log('\n🛑 Setup cancelled by user.\n');
      process.exit(0);
    } else {
      console.error('❌ Unexpected error:', e.message);
      process.exit(1);
    }
  }
};
