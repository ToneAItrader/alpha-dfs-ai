# Deployment Supervisor Guide — Alpha DFS AI

**Capability:** V2.0-4 · **ADR:** [ADR-007](../architecture/ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md)  
**Scope:** DraftKings · NFL · Classic Salary Cap · Version 1 baseline  
**Type:** Operational reference — **no application code changes**

---

## Overview

Alpha DFS AI runs as a single Next.js process on **port 3001** with SQLite persistence. This guide provides copy-paste supervisor templates for production hosts.

**Choose a supervisor:**

| Supervisor | Best for |
|------------|----------|
| **systemd** | Linux VPS / bare metal (**recommended**) |
| **pm2** | Node.js-native process management |
| **Docker Compose** | Containerized single-host deployment |

**Related docs:**

| Doc | Purpose |
|-----|---------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Deploy sequence and certification |
| [PRODUCTION_OPERATIONS_GUIDE.md](./PRODUCTION_OPERATIONS_GUIDE.md) | Operator reference |
| [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md) | Recovery procedure |
| [CONFIGURATION_CHECKLIST.md](./CONFIGURATION_CHECKLIST.md) | Environment validation |

---

## 1. Prerequisites

### Host requirements

| Requirement | Detail |
|-------------|--------|
| Node.js | ≥ 20 |
| npm | Matches lockfile (`npm ci`) |
| Storage | Writable paths for SQLite DB, `backups/`, and provider export files |
| Port | **3001** available (or reverse-proxy to 3001) |

### Environment file

Create `apps/web/.env.local` (or platform secret equivalent) with **absolute paths**:

```bash
DATABASE_URL=file:/opt/alpha-dfs-ai/data/alpha-dfs.db
DRAFTKINGS_EXPORT_PATH=/opt/alpha-dfs-ai/data/draftkings-export.json
PROJECTION_EXPORT_PATH=/opt/alpha-dfs-ai/data/projection-export.json
NODE_ENV=production
```

See [.env.example](../../.env.example) and [CONFIGURATION_CHECKLIST.md](./CONFIGURATION_CHECKLIST.md).

**Production prohibitions:** Do not set `CONNECTOR_MODE=seed`, `ENGINE_REGISTRY_MODE=stub`, or `ALPHA_DFS_ALLOW_SEED_FALLBACK=true`.

### Directory layout (example)

```text
/opt/alpha-dfs-ai/          # Repository root (APP_ROOT)
├── apps/web/.env.local     # Runtime environment
├── data/
│   ├── alpha-dfs.db        # SQLite database
│   ├── draftkings-export.json
│   └── projection-export.json
├── backups/                # VACUUM INTO snapshots
└── .next/                  # Production build output (apps/web/.next)
```

Customize `APP_ROOT`, Unix user, and paths for your host.

---

## 2. Build and deploy sequence

Run deployment **before** starting or restarting the supervisor. The application binary is produced by `npm run build`; the supervisor only runs `next start`.

### Automated deploy

```bash
cd /opt/alpha-dfs-ai
export DATABASE_URL="file:/opt/alpha-dfs-ai/data/alpha-dfs.db"
export DRAFTKINGS_EXPORT_PATH="/opt/alpha-dfs-ai/data/draftkings-export.json"
export PROJECTION_EXPORT_PATH="/opt/alpha-dfs-ai/data/projection-export.json"
export NODE_ENV=production

npm run deploy
```

`deploy.sh` order (current):

1. Pre-deploy backup (if DB exists)
2. `npm ci`
3. `certify:deploy`
4. `db:setup` (skip with `SKIP_DB_SETUP=1` on subsequent deploys)
5. `npm run build`
6. `certify:startup`
7. `deploy:smoke` (full mode — writes to `DATABASE_URL`)

Optional post-deploy backup prune: `PRUNE_BACKUPS=1 npm run deploy`

### Production-safe smoke (no DB writes)

After deploy or for live-host verification:

```bash
SMOKE_MODE=readonly npm run deploy:smoke
DEPLOY_BASE_URL=http://127.0.0.1:3001 SMOKE_MODE=readonly npm run deploy:smoke
```

Use **full** smoke in staging; **readonly** smoke on production.

### Start command (all supervisors)

From repository root:

```bash
npm run start --workspace=@alpha-dfs/web
```

Equivalent: `next start -p 3001` from `apps/web` with env loaded.

### Manual-run charter

The supervisor starts the web process only. **Analyze Slate is manual** — operators trigger analysis from the dashboard. Do not configure cron or supervisor hooks to auto-run refresh/analyze.

---

## 3. Health check integration

Use HTTP health endpoints for readiness probes:

| Endpoint | Use |
|----------|-----|
| `GET /api/health/startup` | Post-deploy / first boot — config + dependencies |
| `GET /api/health/ready` | **Readiness probe** — slate valid, engines available |
| `GET /api/health` | Liveness — overall status |
| `GET /api/health/metrics` | Observability (Class B — not for load balancers) |
| `GET /api/health/diagnostics` | Traces and structured logs |

**Recommended readiness check:**

```bash
curl -sf http://127.0.0.1:3001/api/health/ready | grep -q '"ready":true'
```

Replace host/port if behind a reverse proxy.

---

## 4. systemd (recommended)

### Install unit file

Create `/etc/systemd/system/alpha-dfs-ai.service`:

```ini
[Unit]
Description=Alpha DFS AI — Next.js production server
Documentation=https://github.com/your-org/alpha-dfs-ai
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=alpha-dfs
Group=alpha-dfs
WorkingDirectory=/opt/alpha-dfs-ai

# Load environment (adjust path)
EnvironmentFile=/opt/alpha-dfs-ai/apps/web/.env.local
Environment=NODE_ENV=production

ExecStart=/usr/bin/npm run start --workspace=@alpha-dfs/web
Restart=on-failure
RestartSec=5
StartLimitIntervalSec=60
StartLimitBurst=3

# Hardening (optional — adjust if npm path differs)
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/opt/alpha-dfs-ai/data /opt/alpha-dfs-ai/backups /opt/alpha-dfs-ai/apps/web/.next

StandardOutput=journal
StandardError=journal
SyslogIdentifier=alpha-dfs-ai

[Install]
WantedBy=multi-user.target
```

### Commands

```bash
sudo systemctl daemon-reload
sudo systemctl enable alpha-dfs-ai
sudo systemctl start alpha-dfs-ai
sudo systemctl status alpha-dfs-ai
```

### Restart and logs

```bash
sudo systemctl restart alpha-dfs-ai
journalctl -u alpha-dfs-ai -f
journalctl -u alpha-dfs-ai --since "1 hour ago"
```

### Deploy workflow with systemd

```bash
sudo systemctl stop alpha-dfs-ai
cd /opt/alpha-dfs-ai && npm run deploy
sudo systemctl start alpha-dfs-ai
curl -sf http://127.0.0.1:3001/api/health/ready
```

Stop before deploy when using file-copy backup fallback; VACUUM INTO backup is preferred while running but stopping reduces risk during schema migrations.

---

## 5. pm2

### Install

```bash
npm install -g pm2
```

### Ecosystem file

Create `/opt/alpha-dfs-ai/ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [
    {
      name: "alpha-dfs-ai",
      cwd: "/opt/alpha-dfs-ai",
      script: "npm",
      args: "run start --workspace=@alpha-dfs/web",
      env: {
        NODE_ENV: "production",
      },
      env_file: "/opt/alpha-dfs-ai/apps/web/.env.local",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 3,
      min_uptime: "10s",
      restart_delay: 5000,
      listen_timeout: 10000,
      kill_timeout: 5000,
      merge_logs: true,
      error_file: "/opt/alpha-dfs-ai/logs/pm2-error.log",
      out_file: "/opt/alpha-dfs-ai/logs/pm2-out.log",
    },
  ],
};
```

> **Note:** pm2 `env_file` support varies by version. If unsupported, use `EnvironmentFile` via systemd or export variables in a wrapper script.

### Commands

```bash
mkdir -p /opt/alpha-dfs-ai/logs
pm2 start /opt/alpha-dfs-ai/ecosystem.config.cjs
pm2 save
pm2 startup    # follow printed instructions for boot persistence
pm2 status
pm2 logs alpha-dfs-ai
pm2 restart alpha-dfs-ai
```

### Health verification

```bash
curl -sf http://127.0.0.1:3001/api/health/ready
pm2 describe alpha-dfs-ai
```

---

## 6. Docker Compose

Single-host container deployment. Mount data volumes for SQLite and backups; do not containerize without persistent volumes.

### Compose file

Create `/opt/alpha-dfs-ai/docker-compose.yml`:

```yaml
services:
  alpha-dfs-ai:
    image: node:20-bookworm
    container_name: alpha-dfs-ai
    working_dir: /app
    command: npm run start --workspace=@alpha-dfs/web
    ports:
      - "3001:3001"
    env_file:
      - ./apps/web/.env.local
    environment:
      NODE_ENV: production
    volumes:
      - ./:/app
      - alpha-dfs-node-modules:/app/node_modules
      - ./data:/app/data
      - ./backups:/app/backups
    restart: on-failure
    deploy:
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 60s
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://127.0.0.1:3001/api/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  alpha-dfs-node-modules:
```

### First-time setup

```bash
cd /opt/alpha-dfs-ai
docker compose run --rm alpha-dfs-ai npm ci
docker compose run --rm alpha-dfs-ai npm run deploy
docker compose up -d
docker compose ps
docker compose logs -f alpha-dfs-ai
```

Ensure `DATABASE_URL` in `.env.local` uses paths inside the container (e.g. `file:/app/data/alpha-dfs.db`).

### Deploy update

```bash
docker compose stop alpha-dfs-ai
docker compose run --rm alpha-dfs-ai npm run deploy
docker compose up -d
```

---

## 7. Restart policy

All templates above implement **on-failure** restart with **max 3 attempts per 60 seconds**:

| Supervisor | Setting |
|------------|---------|
| systemd | `Restart=on-failure`, `StartLimitBurst=3`, `StartLimitIntervalSec=60` |
| pm2 | `max_restarts: 3`, `min_uptime: 10s`, `restart_delay: 5000` |
| Docker Compose | `max_attempts: 3`, `window: 60s` |

If the process enters a crash loop, investigate logs and `GET /api/health/startup` before re-enabling traffic. See [Troubleshooting](#10-troubleshooting).

---

## 8. Logging and log rotation

### Default (stdout/stderr)

Supervisors capture process output:

| Supervisor | Log destination |
|------------|-----------------|
| systemd | `journalctl -u alpha-dfs-ai` |
| pm2 | `logs/pm2-out.log`, `logs/pm2-error.log` |
| Docker | `docker compose logs alpha-dfs-ai` |

### Structured application logs

In-process structured logs are available via `GET /api/health/diagnostics` (ring buffer — lost on restart).

### External telemetry (optional — V2.0-1)

For long-term log/metric retention, configure external telemetry export per [ADR-004](../architecture/ADR-004-V2_0_1_TELEMETRY_EXPORT.md):

```bash
TELEMETRY_EXPORT_MODE=file
TELEMETRY_EXPORT_PATH=/opt/alpha-dfs-ai/logs/telemetry.jsonl
TELEMETRY_EXPORT_INTERVAL_MS=30000
```

OTLP mode (HTTP JSON batch to configured endpoint):

```bash
TELEMETRY_EXPORT_MODE=otlp
TELEMETRY_EXPORT_OTLP_ENDPOINT=https://otel-collector.example/v1/logs
TELEMETRY_EXPORT_OTLP_HEADERS='{"Authorization":"Bearer <token>"}'
```

Export starts automatically via Next.js `instrumentation.ts` when mode ≠ `none`. Default is off — V1 behavior unchanged.

Supervisor stdout rotation:

- **systemd:** journald retention via `/etc/systemd/journald.conf`
- **pm2:** `pm2 install pm2-logrotate`
- **Docker:** configure `logging` driver options in compose

---

## 9. Rollback considerations

Follow [ROLLBACK_GUIDE.md](./ROLLBACK_GUIDE.md):

1. **Stop** supervisor (`systemctl stop`, `pm2 stop`, or `docker compose stop`)
2. **Restore** database: `npm run deploy:rollback -- backups/alpha-dfs-<timestamp>.db`
3. **Restore** previous build artifact if code changed (`git checkout` + `npm ci` + `npm run build`)
4. **Validate:** `npm run certify:startup` and `SMOKE_MODE=readonly npm run deploy:smoke`
5. **Start** supervisor and verify `GET /api/health/ready`

Never restore a backup while the application is writing to the database.

---

## 10. Operational best practices

| Practice | Detail |
|----------|--------|
| Absolute paths | Always use absolute `file:` paths for `DATABASE_URL` |
| Backup before deploy | `deploy.sh` backs up automatically when DB exists |
| Retention prune | `npm run deploy:backup:prune` (dry-run) periodically |
| Readonly smoke on prod | `SMOKE_MODE=readonly` after deploy — no slate mutation |
| Full smoke in staging | End-to-end refresh + analyze before production promotion |
| Manual analysis only | Supervisor must not trigger Analyze Slate automatically |
| Reverse proxy | Terminate TLS at nginx/Caddy; proxy to `127.0.0.1:3001` |
| Secrets | Restrict `.env.local` permissions (`chmod 600`) |

### Suggested deploy checklist

```text
1. Stop supervisor (optional — recommended for major upgrades)
2. npm run deploy  (or manual steps from DEPLOYMENT_GUIDE.md)
3. SMOKE_MODE=readonly npm run deploy:smoke
4. Start / restart supervisor
5. curl /api/health/ready
6. Manual Analyze Slate from dashboard
7. Archive backup timestamp + git commit hash
```

---

## 11. Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| Crash loop on start | Invalid `DATABASE_URL` or missing DB | Run `npm run db:setup`; verify absolute path |
| `ready: false` | No valid active slate | Run full smoke in staging or manual refresh |
| Port 3001 in use | Previous process | `ss -tlnp \| grep 3001`; stop orphan process |
| Provider errors | Missing export paths | Check `DRAFTKINGS_EXPORT_PATH`, `PROJECTION_EXPORT_PATH` |
| systemd start limit hit | Repeated failures | `journalctl -u alpha-dfs-ai`; fix root cause; `systemctl reset-failed` |
| pm2 errored | Env not loaded | Verify `env_file` or export vars in wrapper |
| Docker unhealthy | Healthcheck before ready | Increase `start_period`; check logs |
| 500 on dashboard | Cache miss / env missing | Verify `.env.local`; see V1 maintenance notes |

### Diagnostic commands

```bash
npm run certify:deploy
npm run certify:startup
SMOKE_MODE=readonly npm run deploy:smoke
curl -s http://127.0.0.1:3001/api/health/diagnostics | head -c 2000
```

---

## 12. Reverse proxy example (optional)

nginx snippet proxying to port 3001:

```nginx
server {
    listen 443 ssl;
    server_name dfs.example.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Use `DEPLOY_BASE_URL=https://dfs.example.com` for HTTP smoke checks through the proxy.

---

## Document control

| Field | Value |
|-------|-------|
| Capability | V2.0-4 |
| ADR | [ADR-007](../architecture/ADR-007-V2_0_4_DEPLOYMENT_SUPERVISOR.md) |
| Port | 3001 |
| Restart policy | on-failure, max 3 / 60s |
| Code changes | None |
