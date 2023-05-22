CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    ws_type TEXT NOT NULL,
    webhook_url TEXT NOT NULL
);
