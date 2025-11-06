#!/usr/bin/env node
import { prompt } from 'inquirer';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  renameSync,
  rmdirSync,
  rmSync,
} from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

function replaceInFile(filePath, replacements) {
  if (!existsSync(filePath)) return false;
  let content = readFileSync(filePath, 'utf8');
  let modified = false;
  for (const [key, value] of Object.entries(replacements)) {
    if (content.includes(key)) {
      content = content.split(key).join(value);
      modified = true;
    }
  }
  if (modified) writeFileSync(filePath, content, 'utf8');
  return modified;
}

function walk(dir, callback) {
  const files = readdirSync(dir);
  for (const name of files) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, callback);
    else callback(full);
  }
}

// Rename Android package directory (e.g., com/myapp/app)
function renameAndroidPackageDir(oldId, newId) {
  const base = join(root, 'android/app/src/main/java');
  const oldPath = join(base, ...oldId.split('.'));
  const newPath = join(base, ...newId.split('.'));
  if (!existsSync(oldPath)) {
    console.warn(`⚠️ Skipping Android package rename: ${oldPath} not found`);
    return;
  }

  // Create new directories recursively
  mkdirSync(newPath, { recursive: true });

  // Move all files to new location
  const files = readdirSync(oldPath);
  files.forEach(file => {
    renameSync(join(oldPath, file), join(newPath, file));
  });

  // Clean up empty old dirs
  const parts = oldId.split('.');
  for (let i = parts.length; i > 0; i--) {
    const dir = join(base, ...parts.slice(0, i));
    if (existsSync(dir) && readdirSync(dir).length === 0) {
      rmdirSync(dir);
    }
  }

  console.log(`✅ Android package folder renamed: ${oldPath} → ${newPath}`);
}

(async () => {
  console.log('\n🛠️ React Native Template Setup\n');

  // Step 1: Setup app name, bundle id, package name
  const { appName } = await prompt([
    {
      name: 'appName',
      message: 'App name (JS):',
      default: 'myapp',
    },
  ]);
  const safeAppName = appName.toLowerCase().replace(/\s+/g, '');
  const namespace = `com.${safeAppName}`;
  const safeAppId = `${namespace}.app`;

  const { inputBundleId, inputPackageName } = await prompt([
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

  const replacements = {
    'namespace "com.myapp"': `namespace "${namespace}"`,
    'package com.myapp': `package ${namespace}`,
    'applicationId "com.myapp"': `applicationId "${packageName}"`,
    myapp: appName,
    'com.myapp': packageName,
  };

  console.log(`\n📦 Using identifiers:`);
  console.log(`  iOS Bundle ID: ${bundleId}`);
  console.log(`  Android Namespace: ${namespace}`);
  console.log(`  Android Package: ${packageName}\n`);

  // Step 2:  Perform replacements (common places)
  const filesToEdit = [
    'package.json',
    'app.json',
    'android/app/build.gradle',
    'android/app/src/main/AndroidManifest.xml',
    `ios/myapp/Info.plist`,
    `ios/myapp/AppDelegate.swift`,
  ];

  filesToEdit.forEach(file => {
    const full = join(root, file);
    if (replaceInFile(full, replacements)) console.log('✅ Updated', file);
  });

  // Also do a recursive pass to replace placeholders in JS/TS source and configs
  console.log('\n🔎 Scanning project files for placeholders...');
  walk(root, file => {
    // skip node_modules, .git, build, and Pods
    if (
      file.includes('node_modules') ||
      file.includes('.git') ||
      file.includes('/build/') ||
      file.includes('/Pods/') ||
      file.includes('/.idea/') ||
      file.includes('/.vscode/') ||
      file.includes('__tests__')
    ) {
      return;
    }
    // limited to common text file types
    const regex =
      /\.(js|ts|jsx|tsx|json|xml|gradle|plist|properties|txt|pbxproj|png|jpg|jpeg|keystore|a|apk|ipa|pdf)$/;
    if (!regex.test(file)) return;
    // ignore binaries files
    if (/\.(png|jpg|jpeg|keystore|a|apk|ipa|pdf)$/i.test(file)) return;
    replaceInFile(file, replacements);
  });

  // Step 3: Execute react-native-rename for robust renaming (optional)
  const formattedAppName = appName.replace(/[^a-zA-Z0-9]/g, '');
  try {
    console.log(
      '\n⚙️ Running react-native-rename to update native project names...',
    );
    const renameCmd = `npx react-native-rename "${formattedAppName}" -b ${bundleId}`;
    execSync(renameCmd, { stdio: 'inherit' });
  } catch (e) {
    console.warn(
      '⚠️ react-native-rename failed or not installed. Try running:\n' +
        `   npx react-native-rename "${formattedAppName}" -b ${bundleId}\n` +
        '   manually if the app name didn’t update.\n',
    );
  }

  // Step 4: Rename Android package folder
  renameAndroidPackageDir('com.myapp', packageName);

  // Step 5: Reset git history
  const { resetGit } = await prompt([
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
      if (existsSync(join(root, '.git'))) {
        rmSync(join(root, '.git'), { recursive: true, force: true });
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
  console.log('\nNext steps:');
  console.log(' 1️⃣ yarn install');
  console.log(' 2️⃣ npx pod-install (iOS)');
  console.log(' 3️⃣ yarn android or yarn ios');
  console.log('─────────────────────────────\n');
  console.log('\nHappy Coding!');
})();
