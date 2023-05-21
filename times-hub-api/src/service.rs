use crate::entity;
use crate::repository::WorkspaceRepository;
use anyhow::Result;
use serde::Deserialize;
use serde::Serialize;
use std::sync::Arc;
use validator::Validate;

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub struct ResponseWorkspace {
    id: entity::WorkspaceId,
    name: String,
    ws_type: String,
}

/////////////
// Payload //
/////////////

// workspace の作成の POST request body
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Validate)]
pub struct CreateWorkspacePayload {
    #[validate(length(min = 1, message = "text can not be empty"))]
    #[validate(length(max = 100, message = "text can not be longer than 100 characters"))]
    pub name: String,
    #[validate(length(min = 1, message = "text can not be empty"))]
    pub ws_type: String,
    #[validate(length(min = 1, message = "text can not be empty"))]
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
        ws_type: ws.ws_type.to_string(),
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
            ws_type: ws.ws_type.to_string(),
        })
        .collect();
    Ok(ws_vec)
}

pub async fn find_workspace<T>(repo: Arc<T>, id: entity::WorkspaceId) -> Result<ResponseWorkspace>
where
    T: WorkspaceRepository,
{
    let ws = repo.find(id).await?;
    Ok(ResponseWorkspace {
        id: ws.id,
        name: ws.name,
        ws_type: ws.ws_type.to_string(),
    })
}

pub async fn update_workspace<T>(repo: Arc<T>, ws: entity::Workspace) -> Result<ResponseWorkspace>
where
    T: WorkspaceRepository,
{
    let ws = repo.update(ws).await?;
    Ok(ResponseWorkspace {
        id: ws.id,
        name: ws.name,
        ws_type: ws.ws_type.to_string(),
    })
}

pub async fn delete_workspace<T>(repo: Arc<T>, id: entity::WorkspaceId) -> Result<()>
where
    T: WorkspaceRepository,
{
    repo.delete(id).await?;
    Ok(())
}
