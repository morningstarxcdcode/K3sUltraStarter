#!/bin/bash

# K3s uninstallation script

set -euo pipefail

echo "Starting K3s uninstallation..."

if command -v k3s >/dev/null 2>&1; then
  if [ -f /usr/local/bin/k3s-uninstall.sh ]; then
    sudo /usr/local/bin/k3s-uninstall.sh
  fi
  if [ -f /usr/local/bin/k3s-killall.sh ]; then
    sudo /usr/local/bin/k3s-killall.sh
  fi
  echo "K3s uninstalled."
else
  echo "K3s not found, nothing to uninstall."
fi
