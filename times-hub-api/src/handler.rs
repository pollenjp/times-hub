use crate::entity;
use crate::repository::RepositoryError;
use crate::repository::WorkspaceRepository;
use crate::service;
use anyhow::Result;
use axum::async_trait;
use axum::extract::Extension;
use axum::extract::FromRequest;
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::BoxError;
use axum::Json;
use http::Request;
use serde::de::DeserializeOwned;
use serde::Deserialize;
use serde::Serialize;
use std::str::FromStr;
use std::sync::Arc;
use validator::Validate;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Validate)]
pub struct UpdateWorkspacePayload {
    #[validate(length(min = 1, message = "text can not be empty"))]
    #[validate(length(max = 100, message = "text can not be longer than 100 characters"))]
    pub name: String,
    #[validate(length(min = 1, message = "text can not be empty"))]
    pub ws_type: String,
    #[validate(length(min = 1, message = "text can not be empty"))]
    pub webhook_url: String,
}

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

pub async fn find_workspace<T>(
    Extension(repo): Extension<Arc<T>>,
    Path(id): Path<entity::WorkspaceId>,
) -> Result<impl IntoResponse, StatusCode>
where
    T: WorkspaceRepository,
{
    let ws_vec = service::find_workspace(repo, id).await.map_err(|e| {
        tracing::error!("error: {}", e);
        match e.downcast_ref::<RepositoryError>() {
            Some(RepositoryError::NotFound(_)) => StatusCode::NOT_FOUND,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    })?;
    Ok((StatusCode::OK, Json(ws_vec)))
}

pub async fn update_workspace<T>(
    Extension(repo): Extension<Arc<T>>,
    Path(id): Path<entity::WorkspaceId>,
    ValidatedJson(payload): ValidatedJson<UpdateWorkspacePayload>,
) -> Result<impl IntoResponse, StatusCode>
where
    T: WorkspaceRepository,
{
    let ws = entity::Workspace {
        id,
        name: payload.name,
        ws_type: entity::WorkspaceType::from_str(payload.ws_type.as_str())
            .map_err(|_| StatusCode::BAD_REQUEST)?,
        webhook_url: payload.webhook_url,
    };
    let ws_vec = service::update_workspace(repo, ws).await.map_err(|e| {
        tracing::error!("error: {}", e);
        match e.downcast_ref::<RepositoryError>() {
            Some(RepositoryError::NotFound(_)) => StatusCode::NOT_FOUND,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    })?;
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
