#!/bin/bash
shopt -s globstar

# Clean previous build
rm -rf dist/
rm -f lam-backend.exe
rm -rf build/
rm -rf bin/

# Build project and compile
npm run build
npm run build:ncc
npm run build:windows:x64

# Organize output into build directory
mkdir build
cp lam-backend.exe build
cp -r --parents dist/**/*.node build/
cp .env build
cp -r --parents proto/**/*.proto build/
cp -r --parents ./dist/migrations/local/*.js build/
rm lam-backend.exe

# Build installers
npm run build:windows:nsis

# Organize installers output
mkdir bin
cp installer/lam-backend-installer.exe bin/
rm installer/lam-backend-installer.exe

echo "Build completed successfully!"
