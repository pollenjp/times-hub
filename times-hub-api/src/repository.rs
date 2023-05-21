use crate::entity;

use anyhow::Result;
use axum::async_trait;
use entity::Workspace;

#[async_trait]
pub trait WorkspaceRepository: Clone + std::marker::Send + std::marker::Sync + 'static {
    // async fn create(&self, payload: CreateWorkspace) -> Result<Todo>;

    // async fn find(&self, id: entity::TodoTaskId) -> Result<Todo>;

    async fn all(&self) -> Result<Vec<Workspace>>;

    // async fn update(&self, id: entity::TodoTaskId, payload: UpdateWorkspace) -> Result<Todo>;

    // async fn delete(&self, id: entity::TodoTaskId) -> Result<()>;
}

#[cfg(test)]
pub mod test_utils {
    use super::*;
    use axum::async_trait;
    use std::collections::HashMap;
    use std::sync::Arc;
    use std::sync::RwLock;
    use std::sync::RwLockReadGuard;
    use std::sync::RwLockWriteGuard;

    impl Workspace {
        pub fn new(id: entity::WorkspaceId, name: String, webhook_url: String) -> Self {
            Self {
                id,
                name,
                webhook_url,
            }
        }
    }

    type WorkspaceDBOnMemory = HashMap<entity::WorkspaceId, Workspace>;

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
        async fn all(&self) -> Result<Vec<Workspace>> {
            let store = self.read_store_ref();
            let ws_vec = store.values().map(|ws| ws.clone()).collect();
            Ok(ws_vec)
        }
    }

    #[cfg(test)]
    mod test {
        use super::*;

        // vector の比較で sort 用に実装
        impl PartialOrd for Workspace {
            fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
                Some(self.cmp(other))
            }
        }

        // vector の比較で sort 用に実装
        impl Ord for Workspace {
            fn cmp(&self, other: &Self) -> std::cmp::Ordering {
                self.id.cmp(&other.id)
            }
        }

        #[tokio::test]
        async fn todo_crud_scenario() {
            // TODO: 初期データ
            let init_ws_vec = vec![
                Workspace::new(
                    1,
                    "test workspace 1".to_string(),
                    "https://example.com".to_string(),
                ),
                Workspace::new(
                    2,
                    "test workspace 2".to_string(),
                    "https://example.com".to_string(),
                ),
            ];

            // let manipulate_target_data = Workspace {
            //     id: 3,
            //     name: "test workspace 3".to_string(),
            //     webhook_url: "https://example.com".to_string(),
            // };

            let repo = WorkspaceRepositoryForMemory::new();
            // Add init data
            for data in &init_ws_vec {
                repo.write_store_ref().insert(data.id, data.clone());
            }

            // all
            let mut ws_vec = repo.all().await.expect("failed to get all todo");
            let mut expected_ws_vec = init_ws_vec.clone();
            assert_eq!(ws_vec.sort(), expected_ws_vec.sort());
        }
    }
}
