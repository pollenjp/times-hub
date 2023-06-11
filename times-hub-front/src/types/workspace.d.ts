// front での workspace の単位
export type Workspace = {
  id: number
  name: string
  ws_type: string
  webhook_url: string = ""
  checked: boolean = false
}

export type WorkspaceApiResponse = {
  id: number
  name: string
  ws_type: string
}

export type WorkspacePayload = {
  name: string
  ws_type: string
  webhook_url: string
}
