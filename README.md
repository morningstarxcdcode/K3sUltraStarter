# K3sUltraStarter

<p align="center">
  <img src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" alt="Happy Thursday 22 Animation" width="300"/>
</p>

K3sUltraStarter is a lightweight Kubernetes starter project designed to help developers quickly set up a Kubernetes environment with a sample full-stack application. It includes a React frontend and a FastAPI backend, along with Kubernetes manifests and deployment scripts to streamline your development and deployment workflow.

## Why Use K3sUltraStarter?

- **Quick Kubernetes Setup:** Get a minimal yet functional Kubernetes environment up and running fast.
- **Full-Stack Sample App:** Explore a practical example with a React frontend and FastAPI backend.
- **Deployment Ready:** Includes Kubernetes manifests, Helm charts, and deployment scripts.
- **Extensible:** Easily customize and extend the sample app and Kubernetes setup to fit your needs.
- **Learning Resource:** Great for developers new to Kubernetes, React, or FastAPI to learn by example.

## Features

- React frontend with modern tooling and testing setup.
- FastAPI backend with REST API endpoints and integration tests.
- Kubernetes manifests for ingress, storage, deployment, and services.
- CI/CD workflow configured with GitHub Actions.
- Installation and uninstall scripts for easy environment management.

## Getting Started

### Prerequisites

- Docker
- Kubernetes cluster (e.g., k3s, minikube, or any cloud provider)
- kubectl CLI configured to access your cluster
- Node.js and npm/yarn for frontend development
- Python 3.8+ for backend development

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/morningstarxcdcode/K3sUltraStarter.git
   cd K3sUltraStarter
   ```

2. Deploy Kubernetes manifests:

   ```bash
   kubectl apply -f K3sUltraStarter/k8s-manifests/
   ```

3. Build and run the backend:

   ```bash
   cd K3sUltraStarter/sample-app/backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. Build and run the frontend:

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

### Running Tests

- Backend tests:

  ```bash
  cd K3sUltraStarter/sample-app/backend
  pytest
  ```

- Frontend tests:

  ```bash
  cd K3sUltraStarter/sample-app/frontend
  npm test
  ```

## Project Structure

```
.
├── K3sUltraStarter/            # Main project directory
│   ├── k8s-manifests/          # Kubernetes manifests for deployment
│   ├── sample-app/
│   │   ├── backend/            # FastAPI backend source and tests
│   │   └── frontend/           # React frontend source and tests
│   ├── docs/                   # Project documentation
│   ├── install-scripts/        # Scripts to install/uninstall environment
│   ├── tests/                  # Additional test scripts
│   ├── .github/                # GitHub workflows and CI/CD
│   ├── course/                 # Course materials
│   ├── landing-page/           # Landing page files
│   ├── Makefile                # Build and deployment helper commands
│   └── README.md               # Project documentation README
├── cli/                       # CLI scripts
├── public/                    # Public assets
├── src/                       # Source code for frontend app
├── README.md                  # This file
├── package.json               # Frontend package manifest
├── package-lock.json          # Frontend package lock
├── tsconfig.json              # TypeScript config
└── vite.config.ts             # Vite config file
```
└── vite.config.ts             # Vite config file

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

---

For detailed documentation, visit the [docs folder](K3sUltraStarter/docs/README.md).

Happy Kubernetes journey!
