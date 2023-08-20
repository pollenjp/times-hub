pub type WorkspaceIdTypeAlias = i32;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Default)]
pub struct WorkspaceId {
    id: WorkspaceIdTypeAlias,
}

impl WorkspaceId {
    pub fn new(id: WorkspaceIdTypeAlias) -> Self {
        Self { id }
    }
    pub fn to_raw(&self) -> WorkspaceIdTypeAlias {
        self.id
    }
}

impl std::fmt::Display for WorkspaceId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.id.fmt(f) // delegate to i32
    }
}

#[derive(Debug, Clone, PartialEq, Eq, strum::Display, strum::EnumString)]
pub enum WorkspaceType {
    #[strum(serialize = "slack")]
    Slack,
    #[strum(serialize = "discord")]
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
