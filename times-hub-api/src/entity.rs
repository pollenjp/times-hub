pub type WorkspaceId = u32;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum WorkspaceType {
    Slack,
    // Discord, // NotImplemented
}

// DBの各Rowに対応した構造体
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Workspace {
    pub id: WorkspaceId,
    pub name: String,
    pub ws_type: WorkspaceType,
    pub webhook_url: String,
}
