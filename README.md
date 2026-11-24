# Deploy and Host Drizzle Gateway with Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/drizzle-gateway-18-with-postgresql-18?referralCode=20H68q)

Drizzle Gateway is the Drizzle Team's self-hosted server for Drizzle Studio, the database browser of the Drizzle ORM ecosystem. This template deploys Drizzle Gateway 1.8 behind a generated master password, next to a PostgreSQL 18 database on Railway's private network, so you can browse and edit data in Drizzle Studio from your own infrastructure.

## About Hosting Drizzle Gateway

Drizzle Gateway is a single Bun process that serves the Drizzle Studio web app and connects to your databases (PostgreSQL, MySQL, MariaDB, SQLite/Turso/D1 and ClickHouse) from the server side. It stores saved connections and sessions in a small file store that must sit on a persistent volume. The gateway only asks for a login when a master password is set; without one, anyone with the URL gets full access. This template always sets one (generated), refuses to start open if the password is missing or too short, keeps the store on a volume, pins the image by digest, and bundles a private Postgres the gateway can reach as `postgres.railway.internal`.

## Common Use Cases

- Browse and edit tables of a Railway Postgres or MySQL database in Drizzle Studio
- Run SQL in the console, with EXPLAIN/ANALYZE and query telemetry
- Inspect schemas, indexes, policies and roles, and copy CREATE statements
- Import CSV files and export rows as CSV, JSON or SQL inserts
- Give teammates a limited passcode login while keeping the master password to yourself

## Dependencies for Drizzle Gateway Hosting

- Drizzle Gateway (`ghcr.io/drizzle-team/gateway` image)
- A database to manage (bundled: PostgreSQL 18)
- A persistent volume for the gateway's store

### Deployment Dependencies

- Drizzle Gateway: https://gateway.drizzle.team
- Drizzle Gateway Docker notes: https://gateway.drizzle.team/docs/docker
- Drizzle Studio: https://orm.drizzle.team/drizzle-studio/overview
- Railway private networking: https://docs.railway.com/guides/private-networking

### Implementation Details

| Service | Image | Purpose | Public |
|---|---|---|---|
| Drizzle Gateway | `ghcr.io/drizzle-team/gateway:1.8.0` (digest-pinned) + start wrapper | Drizzle Studio UI on port 4983, store volume `/app` | HTTPS domain |
| Postgres | `ghcr.io/railwayapp-templates/postgres-ssl:18.7` (digest-pinned) | Database, volume `/var/lib/postgresql/data` | No (private network only) |

**First login**

1. Open the Drizzle Gateway service → Variables and copy `MASTERPASS`.
2. Open the public domain and enter it.
3. Add a connection: choose PostgreSQL and use the environment variable `DATABASE_URL` (the gateway lists the service's variables), or paste the value of `DATABASE_URL` from the Variables tab. Host `postgres.railway.internal`, SSL mode `disable` or `prefer` (private network).

To rotate the master password, change `MASTERPASS` and redeploy. If it is empty or shorter than 8 characters, the log says so and the gateway is locked with a random password until you set a valid one; it never starts without a login. In the gateway's settings the master can also set a **passcode** for teammates: passcode users can work with connections but cannot read the service's environment variables.

**Connect to other Railway databases**: add a connection in the gateway with the other service's private host (`{service}.railway.internal`) and credentials, or add that service's URL as a variable on the gateway (for example `MYSQL_URL=${{MySQL.MYSQL_URL}}`) and pick it in the dialog. Databases outside the project need their TCP proxy host and port. You can delete the bundled Postgres if you only manage other databases.

**Connect your apps to the bundled Postgres**: reference `${{Postgres.DATABASE_URL}}`. Postgres has no public port; enable a TCP proxy on it to reach it from outside Railway.

**Scaling and upgrades**: run one replica (the store is a file on the volume). To upgrade, change the image tag and digest in `services/gateway/Dockerfile` of your repo copy and redeploy; read the changelog at gateway.drizzle.team first.

**Licence note**: Drizzle Gateway is free but closed-source software from the Drizzle Team, published as a Docker image without a licence file. This template pulls the vendor's image unmodified at deploy time. Check the Drizzle Team's current terms before relying on it commercially. This is a community template and is not affiliated with or endorsed by the Drizzle Team.

### Why Deploy Drizzle Gateway on Railway?

Railway runs the gateway and your databases on one private network with persistent volumes, HTTPS and logs handled for you. You get Drizzle Studio for your Railway databases without exposing them to the internet or running anything on your laptop.
