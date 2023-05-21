pub type WorkspaceId = u32;

// DBの各Rowに対応した構造体
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Workspace {
    pub id: WorkspaceId,
    pub name: String,
    pub webhook_url: String,
}
