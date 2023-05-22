use crate::entity;
use crate::service::CreateWorkspacePayload;
use anyhow::Context;
use anyhow::Result;
use axum::async_trait;
use sqlx::postgres::PgPool;
use sqlx::FromRow;
use std::str::FromStr;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum RepositoryError {
    #[error("Unexpected Error: {0}")]
    Unexpected(String),
    #[error("NotFound! ID is {0}")]
    NotFound(entity::WorkspaceId),
}

#[derive(Debug, Clone, PartialEq, Eq, FromRow)]
pub struct WorkspaceDBRow {
    pub id: entity::WorkspaceId,
    pub name: String,
    pub ws_type: String,
    pub webhook_url: String,
}

#[async_trait]
pub trait WorkspaceRepository: Clone + std::marker::Send + std::marker::Sync + 'static {
    async fn create(&self, payload: CreateWorkspacePayload) -> Result<entity::Workspace>;

    async fn all(&self) -> Result<Vec<entity::Workspace>>;

    async fn find(&self, id: entity::WorkspaceId) -> Result<entity::Workspace>;

    async fn update(&self, payload: entity::Workspace) -> Result<entity::Workspace>;

    async fn delete(&self, id: entity::WorkspaceId) -> Result<()>;
}

pub mod pg {
    use super::*;
    use axum::async_trait;

    #[derive(Debug, Clone)]
    pub struct WorkspaceRepositoryForDB {
        pool: PgPool,
    }

    impl WorkspaceRepositoryForDB {
        pub fn new(pool: PgPool) -> Self {
            Self { pool }
        }
    }

    #[async_trait]
    impl WorkspaceRepository for WorkspaceRepositoryForDB {
        async fn create(&self, payload: CreateWorkspacePayload) -> Result<entity::Workspace> {
            let ws = sqlx::query_as::<_, WorkspaceDBRow>(
                r#"
INSERT INTO workspaces (name, ws_type, webhook_url)
VALUES ($1, $2, $3)
RETURNING id, name, ws_type, webhook_url
            "#,
            )
            .bind(payload.name)
            .bind(payload.ws_type)
            .bind(payload.webhook_url)
            .fetch_one(&self.pool)
            .await?;

            Ok(entity::Workspace {
                id: ws.id,
                name: ws.name,
                ws_type: entity::WorkspaceType::from_str(ws.ws_type.as_str())?,
                webhook_url: ws.webhook_url,
            })
        }

        async fn find(&self, id: entity::WorkspaceId) -> Result<entity::Workspace> {
            let ws = sqlx::query_as::<_, WorkspaceDBRow>(
                r#"
SELECT * FROM workspaces WHERE id = $1
            "#,
            )
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| match e {
                sqlx::Error::RowNotFound => RepositoryError::NotFound(id),
                _ => RepositoryError::Unexpected(e.to_string()),
            })?;

            Ok(entity::Workspace {
                id: ws.id,
                name: ws.name,
                ws_type: entity::WorkspaceType::from_str(ws.ws_type.as_str())?,
                webhook_url: ws.webhook_url,
            })
        }

        async fn all(&self) -> Result<Vec<entity::Workspace>> {
            let ws_vec = sqlx::query_as::<_, WorkspaceDBRow>(
                r#"
SELECT * FROM workspaces ORDER BY id DESC
            "#,
            )
            .fetch_all(&self.pool)
            .await?;

            Ok(ws_vec
                .into_iter()
                .map(|ws| entity::Workspace {
                    id: ws.id,
                    name: ws.name,
                    ws_type: entity::WorkspaceType::from_str(ws.ws_type.as_str()).unwrap(),
                    webhook_url: ws.webhook_url,
                })
                .collect())
        }

        async fn update(&self, payload: entity::Workspace) -> Result<entity::Workspace> {
            let ws_row = sqlx::query_as::<_, WorkspaceDBRow>(
                r#"
UPDATE workspaces
SET name = $1, ws_type = $2, webhook_url = $3
WHERE id = $4
RETURNING *
            "#,
            )
            .bind(payload.name)
            .bind(payload.ws_type.to_string())
            .bind(payload.webhook_url)
            .bind(payload.id)
            .fetch_one(&self.pool)
            .await?;

            Ok(entity::Workspace {
                id: ws_row.id,
                name: ws_row.name,
                ws_type: entity::WorkspaceType::from_str(ws_row.ws_type.as_str())?,
                webhook_url: ws_row.webhook_url,
            })
        }

        async fn delete(&self, id: entity::WorkspaceId) -> Result<()> {
            sqlx::query(
                r#"
DELETE FROM workspaces WHERE id = $1
            "#,
            )
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(|err| match err {
                sqlx::Error::RowNotFound => RepositoryError::NotFound(id),
                _ => RepositoryError::Unexpected(err.to_string()),
            })?;

            Ok(())
        }
    }
}

// #[cfg(test)]
pub mod test_utils {
    use super::*;
    use axum::async_trait;
    use std::collections::HashMap;
    use std::str::FromStr;
    use std::sync::Arc;
    use std::sync::RwLock;
    use std::sync::RwLockReadGuard;
    use std::sync::RwLockWriteGuard;

    impl entity::Workspace {
        pub fn new(
            id: entity::WorkspaceId,
            name: String,
            ws_type: entity::WorkspaceType,
            webhook_url: String,
        ) -> Self {
            Self {
                id,
                name,
                ws_type,
                webhook_url,
            }
        }
    }

    type WorkspaceDBOnMemory = HashMap<entity::WorkspaceId, entity::Workspace>;

    // オンメモリのリポジトリ
    #[derive(Clone, Debug)]
    pub struct WorkspaceRepositoryForMemory {
        store: Arc<RwLock<WorkspaceDBOnMemory>>,
    }

    impl WorkspaceRepositoryForMemory {
        pub fn new() -> Self {
            Self {
                store: Arc::default(),
            }
        }

        fn write_store_ref(&self) -> RwLockWriteGuard<WorkspaceDBOnMemory> {
            self.store.write().unwrap()
        }

        fn read_store_ref(&self) -> RwLockReadGuard<WorkspaceDBOnMemory> {
            self.store.read().unwrap()
        }
    }

    #[async_trait]
    impl WorkspaceRepository for WorkspaceRepositoryForMemory {
        async fn create(&self, payload: CreateWorkspacePayload) -> Result<entity::Workspace> {
            let mut store = self.write_store_ref();
            let id = store.len() as entity::WorkspaceId + 1;
            let ws_type = entity::WorkspaceType::from_str(payload.ws_type.as_str())?;
            let ws = entity::Workspace::new(id, payload.name, ws_type, payload.webhook_url);
            store.insert(id, ws.clone());
            Ok(ws)
        }

        async fn all(&self) -> Result<Vec<entity::Workspace>> {
            let store = self.read_store_ref();
            let ws_vec = store.values().map(|ws| ws.clone()).collect();
            Ok(ws_vec)
        }

        async fn find(&self, id: entity::WorkspaceId) -> Result<entity::Workspace> {
            let store = self.read_store_ref();
            let ws = store.get(&id).ok_or(RepositoryError::NotFound(id))?;
            Ok(ws.clone())
        }

        async fn update(&self, payload: entity::Workspace) -> Result<entity::Workspace> {
            let mut store = self.write_store_ref();

            // check if exists
            store
                .get(&payload.id)
                .context(RepositoryError::NotFound(payload.id))?;

            store.insert(payload.id, payload.clone());
            Ok(payload)
        }

        async fn delete(&self, id: entity::WorkspaceId) -> Result<()> {
            let mut store = self.write_store_ref();
            store.remove(&id).context(RepositoryError::NotFound(id))?;
            Ok(())
        }
    }

    #[cfg(test)]
    mod test {
        use super::*;

        // vector の比較で sort 用に実装
        impl PartialOrd for entity::Workspace {
            fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
                Some(self.cmp(other))
            }
        }

        // vector の比較で sort 用に実装
        impl Ord for entity::Workspace {
            fn cmp(&self, other: &Self) -> std::cmp::Ordering {
                self.id.cmp(&other.id)
            }
        }

        #[tokio::test]
        async fn workspace_crud_scenario() {
            // 初期データ
            let init_ws_vec = vec![
                entity::Workspace::new(
                    1,
                    "test workspace 1".to_string(),
                    entity::WorkspaceType::Slack,
                    "https://example.com".to_string(),
                ),
                entity::Workspace::new(
                    2,
                    "test workspace 2".to_string(),
                    entity::WorkspaceType::Slack,
                    "https://example.com".to_string(),
                ),
            ];

            let repo = WorkspaceRepositoryForMemory::new();
            // Add init data
            for data in &init_ws_vec {
                repo.write_store_ref().insert(data.id, data.clone());
            }

            // create
            let manipulate_target_data = entity::Workspace {
                id: 3,
                name: "test workspace 3".to_string(),
                ws_type: entity::WorkspaceType::Slack,
                webhook_url: "https://example.com".to_string(),
            };
            let payload = CreateWorkspacePayload {
                name: manipulate_target_data.name.clone(),
                ws_type: manipulate_target_data.ws_type.to_string(),
                webhook_url: manipulate_target_data.webhook_url.clone(),
            };
            let ws = repo
                .create(payload)
                .await
                .expect("failed to create workspace");
            assert_eq!(ws, manipulate_target_data);

            // find
            let ws = repo
                .find(manipulate_target_data.id)
                .await
                .expect("failed to find workspace");
            assert_eq!(ws, manipulate_target_data);

            // all
            let mut ws_vec = repo.all().await.expect("failed to get all workspace");
            let mut expected_ws_vec = init_ws_vec.clone();
            expected_ws_vec.push(manipulate_target_data.clone());
            assert_eq!(ws_vec.sort(), expected_ws_vec.sort());

            /////////////////
            // test update //
            /////////////////

            let mut updated_ws = manipulate_target_data.clone();
            updated_ws.name = "updated name".to_string();

            let ws = repo
                .update(updated_ws.clone())
                .await
                .expect("failed to update workspace");
            assert_eq!(ws, updated_ws);

            /////////////////
            // test delete //
            /////////////////

            repo.delete(manipulate_target_data.id)
                .await
                .expect("failed to delete workspace");
            let mut ws_vec = repo.all().await.expect("failed to get all workspace");
            assert_eq!(ws_vec.sort(), init_ws_vec.clone().sort());
        }
    }
}
