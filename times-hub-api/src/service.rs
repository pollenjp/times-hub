use crate::entity;
use crate::repository;

use anyhow::Result;
use repository::WorkspaceRepository;
use serde::Deserialize;
use serde::Serialize;
use std::sync::Arc;
use validator::Validate;

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub struct ResponseWorkspace {
    id: entity::WorkspaceId,
    name: String,
}

// workspace の作成の POST request body
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Validate)]
pub struct CreateWorkspacePayload {
    #[validate(length(min = 1, message = "text can not be empty"))]
    #[validate(length(max = 100, message = "text can not be longer than 100 characters"))]
    pub name: String,
    pub ws_type: String,
    pub webhook_url: String,
}

pub async fn create_workspace<T>(
    repo: Arc<T>,
    payload: CreateWorkspacePayload,
) -> Result<ResponseWorkspace>
where
    T: WorkspaceRepository,
{
    let ws = repo.create(payload).await?;
    Ok(ResponseWorkspace {
        id: ws.id,
        name: ws.name,
    })
}

pub async fn all_workspaces<T>(repo: Arc<T>) -> Result<Vec<ResponseWorkspace>>
where
    T: WorkspaceRepository,
{
    let ws_vec = repo.all().await?;

    // convert Workspace to ResponseWorkspace
    let ws_vec = ws_vec
        .into_iter()
        .map(|ws| ResponseWorkspace {
            id: ws.id,
            name: ws.name,
        })
        .collect();
    Ok(ws_vec)
}
