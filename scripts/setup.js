#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  for (const [key, value] of Object.entries(replacements)) {
    if (content.includes(key)) {
      content = content.split(key).join(value);
      modified = true;
    }
  }
  if (modified) fs.writeFileSync(filePath, content, 'utf8');
  return modified;
}

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const name of files) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, callback);
    else callback(full);
  }
}

// Rename Android package directory (e.g., com/myapp/app)
function renameAndroidPackageDir(oldId, newId) {
  const base = path.join(root, 'android/app/src/main/java');
  const oldPath = path.join(base, ...oldId.split('.'));
  const newPath = path.join(base, ...newId.split('.'));
  if (!fs.existsSync(oldPath)) {
    console.warn(`⚠️ Skipping Android package rename: ${oldPath} not found`);
    return;
  }

  // Create new directories recursively
  fs.mkdirSync(newPath, { recursive: true });

  // Move all files to new location
  const files = fs.readdirSync(oldPath);
  files.forEach(file => {
    fs.renameSync(path.join(oldPath, file), path.join(newPath, file));
  });

  // Clean up empty old dirs
  const parts = oldId.split('.');
  for (let i = parts.length; i > 0; i--) {
    const dir = path.join(base, ...parts.slice(0, i));
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  }

  console.log(`✅ Android package folder renamed: ${oldPath} → ${newPath}`);
}

(async () => {
  console.log('\n🛠️ React Native Template Setup\n');

  // Step 1: Setup app name, bundle id, package name
  const inquirer = (await import('inquirer')).default;
  const { appName, organization } = await inquirer.prompt([
    {
      name: 'appName',
      message: 'App name (JS):',
      default: 'myapp',
    },
    {
      name: 'organization',
      message: "Organization's name (optional):",
      default: '',
    },
  ]);

  const safeAppName = appName.toLowerCase().replace(/\s+/g, '');
  const safeOrganization = organization.toLowerCase().replace(/\s+/g, '');
  const safeAppId =
    'com' +
    (safeOrganization ? `.${safeOrganization}` : '') +
    `.${safeAppName}`;

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

  const bundleId = inputBundleId || safeAppId;
  const packageName = inputPackageName || safeAppId;

  // const replacements = {
  //   'namespace "com.myapp"': `namespace "${namespace}"`,
  //   'package com.myapp': `package ${namespace}`,
  //   'applicationId "com.myapp"': `applicationId "${packageName}"`,
  //   myapp: appName,
  //   'com.myapp': packageName,
  // };

  console.log(`\n📦 Using identifiers:`);
  console.log(`  iOS Bundle ID: ${bundleId}`);
  // console.log(`  Android Namespace: ${namespace}`);
  console.log(`  Android Package: ${packageName}\n`);

  // Step 2:  Perform replacements (common places)
  // const filesToEdit = [
  //   'package.json',
  //   'app.json',
  //   'android/app/build.gradle',
  //   'android/app/src/main/AndroidManifest.xml',
  //   `ios/myapp/Info.plist`,
  //   `ios/myapp/AppDelegate.swift`,
  // ];

  // filesToEdit.forEach(file => {
  //   const full = path.join(root, file);
  //   if (replaceInFile(full, replacements)) console.log('✅ Updated', file);
  // });

  // // Also do a recursive pass to replace placeholders in JS/TS source and configs
  // console.log('\n🔎 Scanning project files for placeholders...');
  // walk(root, file => {
  //   // skip node_modules, .git, build, and Pods
  //   if (
  //     file.includes('node_modules') ||
  //     file.includes('.git') ||
  //     file.includes('/build/') ||
  //     file.includes('/Pods/') ||
  //     file.includes('/.idea/') ||
  //     file.includes('/.vscode/') ||
  //     file.includes('__tests__')
  //   ) {
  //     return;
  //   }
  //   // limited to common text file types
  //   const regex =
  //     /\.(js|ts|jsx|tsx|json|xml|gradle|plist|properties|txt|pbxproj|png|jpg|jpeg|keystore|a|apk|ipa|pdf)$/;
  //   if (!regex.test(file)) return;
  //   // ignore binaries files
  //   if (/\.(png|jpg|jpeg|keystore|a|apk|ipa|pdf)$/i.test(file)) return;
  //   replaceInFile(file, replacements);
  // });

  // Step 3: Execute react-native-rename for robust renaming (optional)
  let renameCmd = `npx react-native-rename "${appName}"`;
  if (bundleId === packageName) {
    renameCmd = `-b "${bundleId}"`;
  } else {
    renameCmd += `--iosBundleID "${bundleId}" --androidBundleID "${packageName}"`;
  }
  try {
    console.log(`\n⚙️ Executing command: ${renameCmd}`);
    execSync(renameCmd, { stdio: 'inherit' });
  } catch (e) {
    console.warn(
      '⚠️ react-native-rename failed or not installed\n.' +
        `   Try running: ${renameCmd}` +
        '   manually if the app name didn’t update.\n',
    );
  }

  // Step 4: Rename Android package folder
  // renameAndroidPackageDir('com.myapp', packageName);

  // Step 5: Reset git history
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
      console.log('\n♻️ Resetting git history...');
      if (fs.existsSync(path.join(root, '.git'))) {
        fs.rmSync(path.join(root, '.git'), { recursive: true, force: true });
      }
      execSync('git init', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Initial commit from template"', {
        stdio: 'inherit',
      });
      console.log('✅ Git reset complete');
    } catch (e) {
      console.warn('⚠️ Failed to reset git:', e.message);
    }
  }

  // Done
  console.log('\n─────────────────────────────');
  console.log('\n🎉 Setup complete!');
  console.log(`📱 App: ${appName}`);
  console.log(`🍏 iOS Bundle ID: ${bundleId}`);
  console.log(`🤖 Android Package: ${packageName}`);
  console.log('─────────────────────────────\n');
})();
