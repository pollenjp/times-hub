mod entity;
mod handler;
mod repository;
mod service;

use axum::routing::get;
use axum::Extension;
use axum::Router;
use dotenv::dotenv;
use std::env;
use std::net::SocketAddr;
use std::sync::Arc;

fn init_logging() {
    let log_level = env::var("RUST_LOG").unwrap_or("info".to_string());
    env::set_var("RUST_LOG", log_level);
    tracing_subscriber::fmt::init();
}

#[tokio::main]
async fn main() {
    init_logging();

    dotenv().ok();

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("Listening on {}", addr);

    let repo = repository::test_utils::WorkspaceRepositoryForMemory::new();

    let app = create_app(repo);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

fn create_app<T>(repo: T) -> Router
where
    T: repository::WorkspaceRepository,
{
    Router::new()
        .route("/", get(root))
        .route("/workspaces", get(handler::all_workspaces::<T>))
        .layer(Extension(Arc::new(repo)))
}

async fn root() -> &'static str {
    "Hello, World!"
}
