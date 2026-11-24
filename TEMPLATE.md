# Drizzle Gateway 1.8 with PostgreSQL 18: Railway template spec

## Listing

| Field | Value |
|---|---|
| Name | **Drizzle Gateway 1.8 with PostgreSQL 18** |
| Description | Self-hosted Drizzle Studio behind a master password, plus Postgres 18. (70 chars) |
| Category | Storage |
| Tags | drizzle, drizzle-studio, drizzle-gateway, postgresql, database, admin, gui |
| Icon | `https://cdn.jsdelivr.net/gh/drizzle-team/drizzle-orm/misc/readme/logo-github-sq-dark.svg` |
| Repo | `baranberkay96/drizzle-gateway-railway`, service root `/services/gateway` |

## Licence / feasibility decision

Drizzle Gateway is free, closed-source software (no licence file, image label `NOASSERTION`). The vendor calls it "Free self-hosted Drizzle Studio", documents Docker self-hosting and links a Railway deploy button. The template pulls the vendor's image at build time (no redistribution by us) and the end user self-hosts it, which is the vendor's intended use. Built, with the caveat in README and NOTICE. No Docker-in-Docker, privileged mode, UDP or GPU needed.

## Base market templates (checked 2026-11-24)

| Code | Name | Total deploys | Stack | Problems |
|---|---|---|---|---|
| `drizzle-studio-gateway` | Drizzle Studio Gateway (vendor-linked, verified) | 264 | `gateway:latest`, volume `/app`, `MASTERPASS=${{secret()}}` | Floating `latest`; no database; an emptied MASTERPASS leaves the UI and API open |
| `xuXPu7` | bun-elysia-drizzle | 57 | app starter + Postgres | Not a gateway |
| `yvPIKJ` | drizzle-pg-proxy | 24 | third-party HTTP proxy + Postgres | Not a gateway |

Kept: vendor image, `/app` volume, `/health` healthcheck, generated `MASTERPASS`.

## Improvements over market templates

1. **Never open**: the wrapper replaces an empty/short/overlong MASTERPASS with a random one (logged, deploy still succeeds); the vendor image would otherwise serve everything without login.
2. Bad `PORT` / `SESSION_TTL_DAYS` values fall back instead of stopping the gateway (STANDARD 8.29).
3. **Ships with a database** (Postgres 18, private) and exposes its URL as `DATABASE_URL`, which the gateway's connection dialog lists.
4. Pinned image digest (1.8.0) instead of `latest`.

## Pinned versions

| Service | Source | Version | Released | Checked |
|---|---|---|---|---|
| Drizzle Gateway | `ghcr.io/drizzle-team/gateway:1.8.0@sha256:aa4043b9…72bb` + `railway-start.mjs` | 1.8.0 | 2026-11-11 | 2026-11-24 |
| Postgres | `ghcr.io/railwayapp-templates/postgres-ssl:18.7@sha256:0abac5c0…7089` | 18.7 | Railway base | 2026-11-24 |

## Services

### Drizzle Gateway

- Repo build (`services/gateway/Dockerfile`): vendor image + `railway-start.mjs` (Bun), which imports the vendor's `/entry/index.js` in the same process.
- Public domain, `targetPort` 4983, `PORT=4983`, healthcheck `/health` (checks the store file, 300 s), restart `ON_FAILURE` ×10, volume `/app`. One replica.

### Postgres

Railway base service (`_railway-base/postgres.json` values), volume `/var/lib/postgresql/data`, private only.

## Resource estimate

RESOURCE_PLACEHOLDER

## Verification checklist

CHECKLIST_PLACEHOLDER

## Open questions

- Commercial terms of Drizzle Gateway are not written down anywhere public (see Licence decision).
- The vendor's own verified template is linked from gateway.drizzle.team with a referral code; ours competes with it.
