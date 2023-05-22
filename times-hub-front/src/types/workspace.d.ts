// front での workspace の単位
export type Workspace = {
  id: number
  name: string
  ws_type: string
  // TODO: 値を持つときと持たないときがある
  webhook_url: string
  checked: boolean = false
}

export type WorkspaceApiResponse = {
  id: number
  name: string
  ws_type: string
}

export type NewWorkspacePayload = {
  name: string
  ws_type: string
  webhook_url: string
}
