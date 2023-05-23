mod entity;
mod handler;
mod repository;
mod service;

use axum::routing::{get, post};
use axum::Extension;
use axum::Router;
use dotenv::dotenv;
use hyper::header::CONTENT_TYPE;
use sqlx::postgres::PgPool;
use std::env;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::{AllowOrigin, Any, CorsLayer};

fn init_logging() {
    let log_level = env::var("RUST_LOG").unwrap_or("info".to_string());
    env::set_var("RUST_LOG", log_level);
    tracing_subscriber::fmt::init();
}

#[tokio::main]
async fn main() {
    init_logging();

    dotenv().ok();

    let use_postgres: bool = true;
    let app;
    if use_postgres {
        let database_url = &env::var("DATABASE_URL").expect("undefined [DATABASE_URL]");
        tracing::debug!("start connecting to database: {}", database_url);
        let pool = PgPool::connect(database_url)
            .await
            .expect(&format!("failed to connect to database: {}", database_url));

        let repo = repository::pg::WorkspaceRepositoryForDB::new(pool);
        app = create_app(repo);
    } else {
        let repo = repository::test_utils::WorkspaceRepositoryForMemory::new();
        app = create_app(repo);
    }

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("Listening on {}", addr);

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
        .route(
            "/workspaces",
            post(handler::create_workspace::<T>).get(handler::all_workspaces::<T>),
        )
        .route(
            "/workspaces/:id",
            get(handler::find_workspace::<T>)
                .patch(handler::update_workspace::<T>)
                .delete(handler::delete_workspace::<T>),
        )
        .route("/message", post(handler::message::send_message::<T>))
        .layer(Extension(Arc::new(repo)))
        .layer(
            CorsLayer::new()
                .allow_methods(Any)
                .allow_headers(vec![CONTENT_TYPE])
                // TODO: Fix hard code
                .allow_origin(AllowOrigin::exact("http://localhost:3001".parse().unwrap())),
        )
}

async fn root() -> &'static str {
    "Hello, World!"
}
