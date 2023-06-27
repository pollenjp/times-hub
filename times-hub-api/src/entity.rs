pub type WorkspaceId = i32;

#[derive(Debug, Clone, PartialEq, Eq, strum::Display, strum::EnumString)]
pub enum WorkspaceType {
    #[strum(serialize = "slack")]
    Slack,
    Discord,
}

// DBの各Rowに対応した構造体
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Workspace {
    pub id: WorkspaceId,
    pub name: String,
    pub ws_type: WorkspaceType,
    pub webhook_url: String,
}
