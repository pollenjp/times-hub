export type Workspace = {
  id: number
  name: string
  ws_type: string
}

export type NewWorkspacePayload = {
  name: string
  ws_type: string
  webhook_url: string
}
