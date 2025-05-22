.PHONY: install deploy cleanup

install:
\tbash install-scripts/install.sh

deploy:
\tkubectl apply -f k8s-manifests/storage.yaml
\tkubectl apply -f k8s-manifests/sample-app/deployment.yaml
\tkubectl apply -f k8s-manifests/sample-app/service.yaml
\tkubectl apply -f k8s-manifests/ingress.yaml

cleanup:
\tbash install-scripts/uninstall.sh
\tkubectl delete -f k8s-manifests/ingress.yaml || true
\tkubectl delete -f k8s-manifests/sample-app/service.yaml || true
\tkubectl delete -f k8s-manifests/sample-app/deployment.yaml || true
\tkubectl delete -f k8s-manifests/storage.yaml || true
