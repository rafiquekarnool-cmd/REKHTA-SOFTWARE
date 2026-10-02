REKHTA offline licensed desktop source — 1.0.26

Windows build steps (Node.js + npm required on build computer):
  npm install
  npm test
  npm run dist
Installer output: dist/REKHTA-Setup-1.0.26-Win8-x64.exe
Electron is pinned to 22.3.27 for Windows 8 x64 compatibility. Actual Windows 8 activation and installation testing is still required before sale.

Activation: launch -> PC Code -> owner-generated key -> editor. Valid activation is stored in userData and verified at each launch. No online login, cloud or activation server.
Copying a license to another PC is rejected. Do not distribute the owner's private signing key or key generator.
Windows registry MachineGuid plus system hardware UUID are required. Machines without a valid UUID require support. Reinstalling Windows or changing machine identity can require reactivation. Existing documents are not deleted.
Licensing is an offline activation control, not a guarantee against reverse engineering. HTML opened independently is not licensed/locked. Sell the packaged desktop application, not the standalone HTML.
No expiration or remote revocation is implemented.
