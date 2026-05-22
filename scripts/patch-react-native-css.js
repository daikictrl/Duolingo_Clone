const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../node_modules/react-native-css/dist/commonjs/metro/index.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');

  // Fix web import paths
  const oldWeb = 'fileBuffer = (0, _injectionCode.getWebInjectionCode)(Array.from(webCSSFiles));';
  const newWeb = 'fileBuffer = (0, _injectionCode.getWebInjectionCode)(Array.from(webCSSFiles).map(p => p.replace(/\\\\/g, "/")));';

  // Fix native import paths
  const oldNative = 'fileBuffer = (0, _injectionCode.getNativeInjectionCode)(Array.from(nativeCSSFiles.keys()).map(key => (0, _nodePath.relative)((0, _nodePath.dirname)(filePath), key)), Array.from(nativeCSSFiles.values()).map(([, value]) => value));';
  const newNative = 'fileBuffer = (0, _injectionCode.getNativeInjectionCode)(Array.from(nativeCSSFiles.keys()).map(key => (0, _nodePath.relative)((0, _nodePath.dirname)(filePath), key).replace(/\\\\/g, "/")), Array.from(nativeCSSFiles.values()).map(([, value]) => value));';

  let changed = false;

  if (content.includes(oldWeb)) {
    content = content.replace(oldWeb, newWeb);
    changed = true;
  }

  if (content.includes(oldNative)) {
    content = content.replace(oldNative, newNative);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('Successfully patched react-native-css for Windows paths compatibility.');
  } else {
    console.log('react-native-css is already patched or target content not found.');
  }
} else {
  console.log('react-native-css metro index.js file not found.');
}
