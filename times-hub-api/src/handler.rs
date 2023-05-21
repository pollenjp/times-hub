use anyhow::Result;
use axum::async_trait;
use axum::extract::Extension;
use axum::extract::FromRequest;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::BoxError;
use axum::Json;
use http::Request;
use serde::de::DeserializeOwned;
use std::sync::Arc;
use validator::Validate;

use crate::repository::WorkspaceRepository;
use crate::service;

pub async fn create_workspace<T>(
    Extension(repo): Extension<Arc<T>>,
    ValidatedJson(payload): ValidatedJson<service::CreateWorkspacePayload>,
) -> Result<impl IntoResponse, StatusCode>
where
    T: WorkspaceRepository,
{
    let ws_vec = service::create_workspace(repo, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok((StatusCode::OK, Json(ws_vec)))
}

// request から抽出し, service のビジネスロジックに委ねる関数
pub async fn all_workspaces<T>(
    Extension(repo): Extension<Arc<T>>,
) -> Result<impl IntoResponse, StatusCode>
where
    T: WorkspaceRepository,
{
    let ws_vec = service::all_workspaces(repo)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok((StatusCode::OK, Json(ws_vec)))
}

#[derive(Debug)]
pub struct ValidatedJson<T>(T);

#[async_trait]
impl<T, S, B> FromRequest<S, B> for ValidatedJson<T>
where
    T: DeserializeOwned + Validate,
    // same as axum::Json::from_request
    B: http_body::Body + Send + 'static,
    B::Data: Send,
    B::Error: Into<BoxError>,
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        let Json(value) = Json::<T>::from_request(req, state)
            .await
            .map_err(|rejection| {
                let message = format!("Json parse error: [{}]", rejection);
                (StatusCode::BAD_REQUEST, message)
            })?;
        value.validate().map_err(|rejection| {
            let message = format!("Validation error: [{}]", rejection).replace('\n', ", ");
            (StatusCode::BAD_REQUEST, message)
        })?;
        Ok(ValidatedJson(value))
    }
}
