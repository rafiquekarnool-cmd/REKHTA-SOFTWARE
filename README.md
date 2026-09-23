# REKHTA Desktop

Windows desktop Urdu & graphic design editor by RK Solution.

## Runtime
- Electron 22.3.27 (kept for Windows 8/8.1 compatibility)
- Offline-first single-page editor
- Embedded Jameel Noori Nastaleeq font data remains inside index.html

## Development test
1. npm install
2. npm start

## Final installer
Run npm run dist only after editor testing is complete.

## Package files
- index.html — complete editor UI and embedded fonts
- main.js — Electron desktop shell
- package.json — pinned Electron/build configuration
- .github/workflows/build-exe.yml — Windows installer workflow

Do not remove the embedded Urdu font block from index.html.
