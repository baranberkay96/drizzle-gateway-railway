# NOTICE: Drizzle Gateway template

## Software deployed

| Component | Licence | Source |
|---|---|---|
| Drizzle Gateway 1.8.0 | **Proprietary freeware, no licence file.** The vendor describes it as "Free self-hosted Drizzle Studio" and links a Railway deploy button from its own site. The image label says `org.opencontainers.image.licenses: NOASSERTION`; source repo `drizzle-team/drizzle-gate` is private. | https://gateway.drizzle.team, image `ghcr.io/drizzle-team/gateway:1.8.0`, pulled from the vendor's registry at build time and used unmodified |
| Bun 1.4.4 (inside the vendor image) | MIT | https://github.com/oven-sh/bun |
| PostgreSQL 18 | PostgreSQL Licence | Railway's `ghcr.io/railwayapp-templates/postgres-ssl` image |

### What this means

- This template does not redistribute the gateway: each deploy pulls the vendor's image from `ghcr.io` and adds one wrapper file on top.
- Self-hosting by the end user is the vendor's intended use (Docker and Railway instructions on gateway.drizzle.team). There are no written terms for commercial use; earlier documentation (v0.1.x, 2025) mentioned a paid licence with a GitHub login, which current versions no longer show. Users should check the Drizzle Team's current terms.

## Written for this template

- `services/gateway/Dockerfile`, `services/gateway/railway-start.mjs`, `template.json`, `README.md`, `TEMPLATE.md`, this file. MIT, © 2026 the template author.

## Upstream sources checked (2026-11-24, read only; nothing was executed locally)

- gateway.drizzle.team: overview, `/docs/docker`, `/docs/how-it-works`, `/docs/railway`, `/docs/changelog` (v1.8.0, 2026-11-11).
- GHCR: tag list and 1.8.0 index digest; image config (entrypoint `bun run index.js`, workdir `/entry`, healthcheck `/health`, licence label NOASSERTION).
- The image's application bundle was read (not run) to confirm the environment variables it uses (`PORT`, `MASTERPASS`, `STORE_PATH`, `SESSION_TTL_DAYS`, `JWT_SECRET`), that every API call except login needs a session when `MASTERPASS` is set and none when it is empty, that `/health` checks the store file, and that it listens on `::`.

## Market templates reviewed

`drizzle-studio-gateway` (Drizzle Studio Gateway, the vendor-linked template), `xuXPu7` (bun-elysia-drizzle), `yvPIKJ` (drizzle-pg-proxy): read for topology and variables only. Nothing was copied.

## Names and affiliation

Drizzle, Drizzle ORM, Drizzle Studio and Drizzle Gateway are names of the Drizzle Team. This is a community template, not affiliated with or endorsed by the Drizzle Team.
