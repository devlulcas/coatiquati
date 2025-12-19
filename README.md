docker compose -f ./docker/docker-compose.dev.yml up -d
pnpm db:generate
pnpm db:push
