# syntax=docker/dockerfile:1
#
# Drizzle Gateway for Railway: the vendor's image, unmodified, plus
# railway-start.mjs (written for this template), which makes sure the gateway
# never starts without a master password and that deploy-form values cannot
# crash it (STANDARD 8.29), then loads the gateway's own /entry/index.js.
#
# Upstream: Drizzle Gateway by the Drizzle Team, a free, closed-source
# self-hosted binary (no licence file; see NOTICE.md). Image
# ghcr.io/drizzle-team/gateway, tag 1.8.0 (released 2026-11-11), pinned by
# multi-arch index digest (checked 2026-11-24). The image is distroless (no
# shell), so the wrapper is JavaScript run by the image's own Bun.
FROM ghcr.io/drizzle-team/gateway:1.8.0@sha256:aa4043b95d7668905415db777c20f7255eb80e469fc07d6c4a5a176eb6f572bb

COPY railway-start.mjs /railway/railway-start.mjs

# Syntax check at build time (exec form: the image has no shell).
RUN ["bun", "build", "/railway/railway-start.mjs", "--target=bun", "--outfile=/tmp/railway-start-check.js"]

ENV PORT=4983
EXPOSE 4983

ENTRYPOINT ["bun", "/railway/railway-start.mjs"]
