# Fault-Tolerant Cloud Webapp Starter

Production-focused TypeScript/Fastify service with cloud deployment assets for heavy traffic.

## Built-in resilience features
- Health probes: `/health/live`, `/health/ready`
- Graceful shutdown for zero-downtime rolling deployments
- Circuit breaker + retry for downstream dependencies
- Request timeout and global rate limiting
- Security headers and structured logging
- Kubernetes HA defaults: multi-replica, anti-affinity, HPA, PDB

## Local run
```bash
npm ci
npm run dev
```

## Render deployment
This repo includes a Render blueprint in [render.yaml](/Users/vignesh/Documents/New%20project/render.yaml).

1. Push the project to a GitHub repository.
2. Sign in to [Render](https://render.com).
3. Create a new Blueprint and select your GitHub repo.
4. Render will detect `render.yaml` and create the web service.
5. After deploy completes, open the generated `onrender.com` URL.

Build settings used:
- Build command: `npm ci && npm run build`
- Start command: `npm start`

Important:
- Registrations are currently stored in `data/registrations.json`.
- On Render, local file storage is not a reliable long-term database.
- If you want registrations to persist safely, move them to a real database before using the app publicly.

## Build and run container
```bash
docker build -t ha-cloud-webapp:latest .
docker run -p 8080:8080 ha-cloud-webapp:latest
```

## Load test
```bash
npm run load
# or custom target
TARGET_URL=http://localhost:8080 CONNECTIONS=500 DURATION=60 npm run load
```

## Kubernetes deployment
1. Update image in `k8s/deployment.yaml`.
2. Update host in `k8s/ingress.yaml`.
3. Deploy:
```bash
kubectl apply -k k8s/
```

## Recommended cloud architecture
- Managed Kubernetes (EKS, GKE, AKS)
- Multi-zone node pools
- Managed ingress/load balancer with TLS
- External managed cache and database with multi-AZ replicas
- Metrics + tracing + centralized logs

## Required environment variables
- `PORT` (default `8080`)
- `HOST` (default `0.0.0.0`)
- `DOWNSTREAM_URL` (optional)

## SLO/operations baseline
- At least 4 replicas for production start
- HPA target CPU 65%, memory 75%
- PDB minAvailable 3
- RollingUpdate with `maxUnavailable: 0`
