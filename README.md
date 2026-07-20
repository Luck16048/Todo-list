# Todo List — FE + BE

Simple todo list app built to understand how a front-end and back-end communicate over HTTP.

## Tech stack

**Backend:** Java 17, Javalin, jOOQ, MySQL, Flyway
**Frontend:** vanilla HTML, CSS, JavaScript (no framework)

## Architecture

```
Browser (fetch)
    │  HTTP + JSON
    ▼
Javalin (Main.java) — routes
    ▼
Service — validation, business logic
    ▼
Repository — jOOQ queries
    ▼
MySQL (todo table, Flyway-managed schema)
```

## API

| Method | Endpoint       | Description                  |
|--------|----------------|-------------------------------|
| GET    | `/todo`        | List all todos                |
| GET    | `/todo/{id}`   | Get one todo                  |
| POST   | `/todo`        | Create a todo (`{ title }`)   |
| PATCH  | `/todo/{id}`   | Partial update (title/completed) |
| DELETE | `/todo/{id}`   | Delete a todo                 |

## Running locally

1. Create a MySQL database:
   ```sql
   CREATE DATABASE todo_db;
   ```
2. Set environment variables (IntelliJ → Run/Debug Configurations → Environment variables):
   ```
   DB_URL=jdbc:mysql://localhost:3306/name
   DB_USERNAME=root
   DB_PASSWORD=<your password>
   ```
3. Run `Main.java` — Flyway applies the schema automatically, server starts on port `8081`.
4. Open `frontend/index.html` via IntelliJ's built-in browser preview (or any local server).

## What this project covers

- REST API design (GET/POST/PATCH/DELETE) with Javalin
- jOOQ without code generation (`DSL.field()` / `DSL.table()`)
- Flyway-managed schema migrations
- Partial updates (`PATCH` with a `Map<String, Object>` + `containsKey` checks)
- CORS: understanding why the browser blocks cross-origin `fetch()` calls by default, and how to explicitly allow a trusted origin in Javalin
