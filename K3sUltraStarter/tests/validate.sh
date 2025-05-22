#!/bin/bash

# Validate K3s deployment and sample app

set -e

echo "Checking K3s status..."
kubectl get nodes

echo "Checking sample-app backend pods..."
kubectl get pods -l app=sample-app-backend

echo "Checking sample-app frontend pods..."
kubectl get pods -l app=sample-app-frontend

echo "Checking services..."
kubectl get svc sample-app-backend sample-app-frontend

echo "Checking ingress..."
kubectl get ingress k3sultra-ingress

echo "Validation complete."
