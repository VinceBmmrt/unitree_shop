#!/bin/bash

# Unitree Shop - Development Start Script Mac and Linux
# This script starts both API and Web in parallel.

echo "🚀 Starting Unitree Shop Development Environment..."

# Check for pnpm
if ! command -v pnpm &> /dev/null
then
    echo "❌ Error: pnpm is not installed. Please install it with 'npm install -g pnpm'"
    exit 1
fi

# Run dev command
pnpm dev
