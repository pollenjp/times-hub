use crate::entity;
use crate::repository;

use anyhow::Result;
use repository::WorkspaceRepository;
use serde::Deserialize;
use serde::Serialize;
use std::sync::Arc;

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub struct ResponseWorkspace {
    id: entity::WorkspaceId,
    name: String,
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
