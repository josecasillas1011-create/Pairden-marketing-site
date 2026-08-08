#!/bin/bash
# Builds a clean deploy folder at ~/Desktop/pairden-deploy
# Strips: reference/ (Jose's V1), .git, es/ (held pending review), .md docs
set -e
cd ~/Desktop
rm -rf pairden-deploy
cp -R pairden-site-v2-setup/marketing-site pairden-deploy
cd pairden-deploy
rm -rf reference .git es
rm -f *.md preview-server.py build-deploy.sh
echo "Ready. Drag ~/Desktop/pairden-deploy onto Netlify."
ls
