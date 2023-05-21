use anyhow::Result;
use axum::extract::Extension;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use std::sync::Arc;

use crate::repository::WorkspaceRepository;
use crate::service;

// request から抽出し, service のビジネスロジックに委ねる関数
pub async fn all_workspaces<T>(
    Extension(repo): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode>
where
    T: WorkspaceRepository,
{
    let ws_vec = service::all_workspace(repo)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok((StatusCode::OK, Json(ws_vec)))
}
