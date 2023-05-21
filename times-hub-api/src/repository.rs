use crate::entity;
use crate::service::CreateWorkspacePayload;

use anyhow::Result;
use axum::async_trait;

#[async_trait]
pub trait WorkspaceRepository: Clone + std::marker::Send + std::marker::Sync + 'static {
    async fn create(&self, payload: CreateWorkspacePayload) -> Result<entity::Workspace>;

    // async fn find(&self, id: entity::TodoTaskId) -> Result<Todo>;

    async fn all(&self) -> Result<Vec<entity::Workspace>>;

    // async fn update(&self, id: entity::TodoTaskId, payload: UpdateWorkspace) -> Result<Todo>;

    // async fn delete(&self, id: entity::TodoTaskId) -> Result<()>;
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
        async fn todo_crud_scenario() {
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
            let ws = repo.create(payload).await.expect("failed to create todo");
            assert_eq!(ws, manipulate_target_data);

            // all
            let mut ws_vec = repo.all().await.expect("failed to get all todo");
            let mut expected_ws_vec = init_ws_vec.clone();
            expected_ws_vec.push(manipulate_target_data.clone());
            assert_eq!(ws_vec.sort(), expected_ws_vec.sort());
        }
    }
}
