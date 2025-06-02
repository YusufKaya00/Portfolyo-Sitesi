#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm ci

# Build project
npm run build

# Output build info
echo 'Build completed successfully!'
