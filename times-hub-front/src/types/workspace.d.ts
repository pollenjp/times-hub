// front での workspace の単位
export type Workspace = {
  id: number
  name: string
  ws_type: string
  checked: boolean
}

type SubsetKeysOf<T> = { [P in keyof T]?: T[P] }

export type WorkspaceDefault = SubsetKeysOf<Workspace> & {
  checked: boolean
}

export const WorkspaceDefaultValue: WorkspaceDefault = {
  checked: false
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

export type UpdateWorkspacePayload = {
  id: number
  name: string
  ws_type: string
  webhook_url: string
}
