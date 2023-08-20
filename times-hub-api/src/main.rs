mod entity;
mod message;
mod workspace;

use ::anyhow::{Context, Result};
use ::axum::routing::{get, post};
use ::axum::Extension;
use ::axum::Router;
use ::dotenv::dotenv;
use ::http::header::HeaderValue;
use ::hyper::header::CONTENT_TYPE;
use ::sqlx::postgres::PgPool;
use ::std::env;
use ::std::net::SocketAddr;
use ::std::str::FromStr;
use ::std::sync::Arc;
use ::tower_http::cors::{AllowOrigin, Any, CorsLayer};
use message::handler::send_message;
use workspace::handler::{
    all_workspaces, create_workspace, delete_workspace, find_workspace, update_workspace,
};
use workspace::repository;

fn init_logging() {
    let log_level = env::var("RUST_LOG").unwrap_or("info".to_string());
    env::set_var("RUST_LOG", log_level);
    tracing_subscriber::fmt::init();
}

#[derive(Debug, Clone)]
struct Config {
    // app_host: std::net::IpAddr,
    host_ip: String,
    host_port: u16,
    allow_origins: Option<Vec<HeaderValue>>,
}

impl Config {
    fn load() -> Result<Self> {
        let host_ip = env::var("TIMES_HUB_APP_HOST_IP").unwrap_or("127.0.0.1".to_string());
        let host_port = env::var("TIMES_HUB_APP_HOST_PORT")
            .context("undefined [TIMES_HUB_APP_HOST_PORT]")?
            .parse()
            .context("invalid [TIMES_HUB_APP_HOST_PORT]")?;
        // result to optional
        let allow_origins = match env::var("TIMES_HUB_APP_ALLOW_ORIGINS") {
            // TODO: parse from json list format
            Ok(s) => Some(vec![HeaderValue::from_str(s.as_str())?]),
            Err(_) => None,
        };
        Ok(Self {
            host_ip,
            host_port,
            allow_origins,
        })
    }
}

#[tokio::main]
async fn main() {
    init_logging();

    dotenv().ok();

    let config: Config = match Config::load() {
        Ok(c) => {
            tracing::debug!("config: {:?}", &c);
            c
        }
        Err(e) => {
            tracing::error!("loading config: {}", e);
            std::process::exit(1);
        }
    };

    let use_postgres: bool = true;
    let app;
    if use_postgres {
        let database_url = &env::var("DATABASE_URL").expect("undefined [DATABASE_URL]");
        tracing::debug!("start connecting to database: {}", database_url);
        let pool = PgPool::connect(database_url)
            .await
            .expect(&format!("failed to connect to database: {}", database_url));

        let repo = repository::pg::WorkspaceRepositoryForDB::new(pool);
        app = create_app(repo, &config);
    } else {
        let repo = repository::test_utils::WorkspaceRepositoryForMemory::new();
        app = create_app(repo, &config);
    }

    let addr =
        match SocketAddr::from_str(format!("{}:{}", &config.host_ip, &config.host_port).as_str()) {
            Ok(a) => a,
            Err(e) => {
                tracing::error!(
                    "invalid [TIMES_HUB_APP_HOST:{}] or [TIMES_HUB_APP_PORT:{}]: {}",
                    &config.host_ip,
                    &config.host_port,
                    e
                );
                std::process::exit(1);
            }
        };
    tracing::debug!("Listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

fn create_app<T>(repo: T, config: &Config) -> Router
where
    T: repository::WorkspaceRepository,
{
    let mut cors_layer = CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(vec![CONTENT_TYPE]);
    match config.allow_origins.clone() {
        Some(allow_origins) => {
            cors_layer = cors_layer.allow_origin(allow_origins);
        }
        None => {
            cors_layer = cors_layer.allow_origin(AllowOrigin::any());
        }
    }
    Router::new()
        .route("/", get(root))
        .route(
            "/workspaces",
            post(create_workspace::<T>).get(all_workspaces::<T>),
        )
        .route(
            "/workspaces/:id",
            get(find_workspace::<T>)
                .patch(update_workspace::<T>)
                .delete(delete_workspace::<T>),
        )
        .route("/message", post(send_message::<T>))
        .layer(Extension(Arc::new(repo)))
        .layer(cors_layer)
}

async fn root() -> &'static str {
    "Hello, World!"
}
