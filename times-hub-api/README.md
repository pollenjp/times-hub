# times-hub-api

## Development

### requirements

`.env`

```.env
DATABASE_URL="postgres://admin:admin@localhost:5432/workspaces"
```

```sh
cargo install sqlx-cli
cargo binstall cargo-watch  # or `cargo install cargo-watch`
```

### Local run

```sh
make db-up
make dev
```
