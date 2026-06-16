#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const APP_NAME_REGEX = /^[A-Za-z][A-Za-z0-9_]*$/;
const PACKAGE_NAME_REGEX = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function replaceInFile(filePath, replacer) {
  const content = readText(filePath);
  const updated = typeof replacer === 'function' ? replacer(content) : content.replace(...replacer);
  writeText(filePath, updated);
}

function pathExists(targetPath) {
  return fs.existsSync(targetPath);
}

function renamePath(fromPath, toPath) {
  if (!pathExists(fromPath)) {
    throw new Error(`Path not found: ${fromPath}`);
  }
  if (pathExists(toPath)) {
    throw new Error(`Target already exists: ${toPath}`);
  }
  fs.renameSync(fromPath, toPath);
}

function packageToDirSegments(packageName) {
  return packageName.split('.');
}

function packageToPath(packageName) {
  return path.join('android', 'app', 'src', 'main', 'java', ...packageToDirSegments(packageName));
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function appNameToPackageSlug(appName) {
  return appName.replace(/[^A-Za-z0-9]+/g, '').toLowerCase();
}

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function readCurrentValues() {
  const appJsonPath = path.join(ROOT, 'app.json');
  const buildGradlePath = path.join(ROOT, 'android', 'app', 'build.gradle');

  const appJson = JSON.parse(readText(appJsonPath));
  const buildGradle = readText(buildGradlePath);
  const applicationIdMatch = buildGradle.match(/applicationId\s+"([^"]+)"/);

  if (!applicationIdMatch) {
    throw new Error('Could not read applicationId from android/app/build.gradle');
  }

  return {
    appName: appJson.name,
    displayName: appJson.displayName,
    packageName: applicationIdMatch[1],
  };
}

function validateAppName(value) {
  if (!APP_NAME_REGEX.test(value)) {
    return 'App name must start with a letter and contain only letters, numbers, or underscores.';
  }
  return null;
}

function validateDisplayName(value) {
  if (!value.trim()) {
    return 'Display name cannot be empty.';
  }
  return null;
}

function validatePackageName(value) {
  if (!PACKAGE_NAME_REGEX.test(value)) {
    return 'Package name must be a reverse-domain identifier (e.g. com.acme.myapp).';
  }
  return null;
}

function isGitDirty() {
  try {
    const status = execSync('git status --porcelain', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return status.length > 0;
  } catch {
    return false;
  }
}

function removeEmptyDirs(dirPath) {
  if (!pathExists(dirPath)) {
    return;
  }

  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) {
    return;
  }

  for (const entry of fs.readdirSync(dirPath)) {
    const entryPath = path.join(dirPath, entry);
    if (fs.statSync(entryPath).isDirectory()) {
      removeEmptyDirs(entryPath);
    }
  }

  if (fs.readdirSync(dirPath).length === 0) {
    fs.rmdirSync(dirPath);
  }
}

function moveAndroidPackage(oldPackage, newPackage, newAppName) {
  const oldDir = path.join(ROOT, packageToPath(oldPackage));
  const newDir = path.join(ROOT, packageToPath(newPackage));

  if (!pathExists(oldDir)) {
    throw new Error(`Android source directory not found: ${oldDir}`);
  }

  if (oldPackage === newPackage) {
    for (const fileName of ['MainActivity.kt', 'MainApplication.kt']) {
      const filePath = path.join(oldDir, fileName);
      if (pathExists(filePath)) {
        replaceInFile(filePath, (content) =>
          content
            .replace(/^package\s+[^\n]+/m, `package ${newPackage}`)
            .replace(/getMainComponentName\(\): String = "[^"]+"/, `getMainComponentName(): String = "${newAppName}"`),
        );
      }
    }
    return;
  }

  fs.mkdirSync(newDir, { recursive: true });

  for (const fileName of fs.readdirSync(oldDir)) {
    if (!fileName.endsWith('.kt')) {
      continue;
    }

    const sourcePath = path.join(oldDir, fileName);
    let content = readText(sourcePath);
    content = content.replace(/^package\s+[^\n]+/m, `package ${newPackage}`);

    if (fileName === 'MainActivity.kt') {
      content = content.replace(
        /getMainComponentName\(\): String = "[^"]+"/,
        `getMainComponentName(): String = "${newAppName}"`,
      );
    }

    writeText(path.join(newDir, fileName), content);
    fs.unlinkSync(sourcePath);
  }

  removeEmptyDirs(path.join(ROOT, 'android', 'app', 'src', 'main', 'java'));
}

function replaceAppNameInContent(content, oldAppName, newAppName) {
  return content.split(oldAppName).join(newAppName);
}

function updateIosProjectFiles(current, next) {
  const iosDir = path.join(ROOT, 'ios');
  const oldAppName = current.appName;
  const newAppName = next.appName;
  const appFolder = path.join(iosDir, oldAppName);

  replaceInFile(path.join(iosDir, 'Podfile'), (content) =>
    content.replace(/target\s+'[^']+'\s+do/, `target '${newAppName}' do`),
  );

  replaceInFile(path.join(appFolder, 'Info.plist'), (content) => {
    const escapedDisplayName = escapeXml(next.displayName);
    return content.replace(
      /(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,
      `$1${escapedDisplayName}$2`,
    );
  });

  replaceInFile(path.join(appFolder, 'AppDelegate.swift'), (content) =>
    content.replace(/withModuleName:\s*"[^"]+"/, `withModuleName: "${newAppName}"`),
  );

  replaceInFile(path.join(appFolder, 'LaunchScreen.storyboard'), (content) =>
    content.replace(
      new RegExp(`text="${escapeRegExp(current.displayName)}"`, 'g'),
      `text="${escapeXml(next.displayName)}"`,
    ),
  );

  const pbxprojPath = path.join(iosDir, `${oldAppName}.xcodeproj`, 'project.pbxproj');
  replaceInFile(pbxprojPath, (content) => {
    let updated = replaceAppNameInContent(content, oldAppName, newAppName);
    updated = updated.replace(
      /PRODUCT_BUNDLE_IDENTIFIER = "[^"]+";/g,
      `PRODUCT_BUNDLE_IDENTIFIER = "${next.packageName}";`,
    );
    return updated;
  });

  const schemePath = path.join(
    iosDir,
    `${oldAppName}.xcodeproj`,
    'xcshareddata',
    'xcschemes',
    `${oldAppName}.xcscheme`,
  );
  replaceInFile(schemePath, (content) => replaceAppNameInContent(content, oldAppName, newAppName));

  const workspaceDataPath = path.join(iosDir, `${oldAppName}.xcworkspace`, 'contents.xcworkspacedata');
  replaceInFile(workspaceDataPath, (content) => replaceAppNameInContent(content, oldAppName, newAppName));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renameIosProject(current, next) {
  if (current.appName === next.appName) {
    return;
  }

  const iosDir = path.join(ROOT, 'ios');
  const oldAppName = current.appName;
  const newAppName = next.appName;

  renamePath(path.join(iosDir, oldAppName), path.join(iosDir, newAppName));
  renamePath(
    path.join(iosDir, `${oldAppName}.xcodeproj`),
    path.join(iosDir, `${newAppName}.xcodeproj`),
  );

  const schemeDir = path.join(iosDir, `${newAppName}.xcodeproj`, 'xcshareddata', 'xcschemes');
  renamePath(
    path.join(schemeDir, `${oldAppName}.xcscheme`),
    path.join(schemeDir, `${newAppName}.xcscheme`),
  );

  renamePath(
    path.join(iosDir, `${oldAppName}.xcworkspace`),
    path.join(iosDir, `${newAppName}.xcworkspace`),
  );
}

function applyRename(current, next) {
  writeText(
    path.join(ROOT, 'app.json'),
    `${JSON.stringify({ name: next.appName, displayName: next.displayName }, null, 2)}\n`,
  );

  replaceInFile(path.join(ROOT, 'package.json'), (content) => {
    const pkg = JSON.parse(content);
    pkg.name = appNameToPackageSlug(next.appName);
    return `${JSON.stringify(pkg, null, 2)}\n`;
  });

  replaceInFile(path.join(ROOT, 'android', 'settings.gradle'), (content) =>
    content.replace(/rootProject\.name = '[^']+'/, `rootProject.name = '${next.appName}'`),
  );

  replaceInFile(path.join(ROOT, 'android', 'app', 'build.gradle'), (content) =>
    content
      .replace(/namespace\s+"[^"]+"/, `namespace "${next.packageName}"`)
      .replace(/applicationId\s+"[^"]+"/, `applicationId "${next.packageName}"`),
  );

  replaceInFile(path.join(ROOT, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml'), (content) =>
    content.replace(
      /(<string name="app_name">)[^<]*(<\/string>)/,
      `$1${escapeXml(next.displayName)}$2`,
    ),
  );

  moveAndroidPackage(current.packageName, next.packageName, next.appName);
  updateIosProjectFiles(current, next);
  renameIosProject(current, next);
}

function printSummary(current, next) {
  console.log('\nRename summary:');
  console.log(`  App name:      ${current.appName} -> ${next.appName}`);
  console.log(`  Display name:  ${current.displayName} -> ${next.displayName}`);
  console.log(`  Package name:  ${current.packageName} -> ${next.packageName}`);
  console.log(`  package.json:  ${appNameToPackageSlug(current.appName)} -> ${appNameToPackageSlug(next.appName)}`);
}

function printPostRenameSteps() {
  console.log('\nNext steps:');
  console.log('  yarn install');
  console.log('  yarn pod-install      # macOS only — regenerates CocoaPods targets');
  console.log('  cd android && ./gradlew clean && cd ..');
  console.log('\nOptional: delete ios/build and android/app/build if they exist.');
}

async function promptForValue(rl, label, currentValue, validate) {
  while (true) {
    const answer = (await ask(rl, `${label} [${currentValue}]: `)).trim();
    const value = answer || currentValue;
    const error = validate(value);
    if (error) {
      console.log(`  ${error}`);
      continue;
    }
    return value;
  }
}

async function main() {
  console.log('React Native app rename\n');

  const current = readCurrentValues();
  console.log(`Current app name:     ${current.appName}`);
  console.log(`Current display name: ${current.displayName}`);
  console.log(`Current package name: ${current.packageName}\n`);

  if (isGitDirty()) {
    console.log('Warning: git working tree has uncommitted changes. Consider committing or branching first.\n');
  }

  const rl = createInterface();

  try {
    const next = {
      appName: await promptForValue(rl, 'App name (internal RN module name)', current.appName, validateAppName),
      displayName: await promptForValue(
        rl,
        'Display name (home-screen label)',
        current.displayName,
        validateDisplayName,
      ),
      packageName: await promptForValue(
        rl,
        'Package name (e.g. com.company.app)',
        current.packageName,
        validatePackageName,
      ),
    };

    const unchanged =
      next.appName === current.appName &&
      next.displayName === current.displayName &&
      next.packageName === current.packageName;

    if (unchanged) {
      console.log('\nNo changes requested. Exiting.');
      return;
    }

    printSummary(current, next);

    const confirmation = (await ask(rl, '\nApply these changes? (y/N): ')).trim().toLowerCase();
    if (confirmation !== 'y' && confirmation !== 'yes') {
      console.log('Aborted.');
      return;
    }

    applyRename(current, next);
    console.log('\nApp rename completed successfully.');
    printPostRenameSteps();
  } catch (error) {
    console.error(`\nRename failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();
