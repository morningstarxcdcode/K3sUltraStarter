#!/bin/bash

# K3s installation script
# Supports MacOS, Linux, Raspberry Pi

set -euo pipefail

echo "Starting K3s installation..."

detect_os() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macos"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "linux"
  else
    echo "unsupported"
  fi
}

OS=$(detect_os)

if [ "$OS" = "macos" ]; then
  echo "Detected MacOS"
  if command -v brew >/dev/null 2>&1; then
    echo "Installing k3d via Homebrew..."
    brew install k3d
  else
    echo "Homebrew not found. Please install Homebrew first."
    exit 1
  fi
elif [ "$OS" = "linux" ]; then
  echo "Detected Linux"
  if command -v curl >/dev/null 2>&1; then
    echo "Installing K3s using official install script..."
    curl -sfL https://get.k3s.io | sh -
  else
    echo "curl not found. Please install curl first."
    exit 1
  fi
else
  echo "Unsupported OS: $OSTYPE"
  exit 1
fi

echo "K3s installation completed."
