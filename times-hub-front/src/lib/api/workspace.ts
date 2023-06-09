import type {
  UpdateWorkspacePayload,
  WorkspacePayload,
  Workspace,
  WorkspaceApiResponse
} from "../../types/workspace"
import { getWorkspaceDefaultValue } from "../../types/workspaceDefault"

// TODO: fix hard code url
const db_url_base = "http://localhost:3000"

export const addWorkspaceItem = async (payload: WorkspacePayload) => {
  const res = await fetch(`${db_url_base}/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    throw new Error("Add request failed")
  }
  const json: WorkspaceApiResponse = await res.json()
  const ws: Workspace = {
    ...getWorkspaceDefaultValue(),
    id: json.id,
    name: json.name,
    ws_type: json.ws_type
  }
  return ws
}

export const getWorkspaceItems = async () => {
  const res = await fetch(`${db_url_base}/workspaces`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (!res.ok) {
    throw new Error("get request failed")
  }
  const json: WorkspaceApiResponse[] = await res.json()
  const ws_array: Workspace[] = json.map((ws) => {
    return {
      ...getWorkspaceDefaultValue(),
      id: ws.id,
      name: ws.name,
      ws_type: ws.ws_type
    }
  })

  return ws_array
}

export const updateWorkspaceItem = async (ws: UpdateWorkspacePayload) => {
  const id = ws.id
  const payload: WorkspacePayload = {
    name: ws.name,
    ws_type: ws.ws_type,
    webhook_url: ws.webhook_url
  }
  console.log(payload)
  const res = await fetch(`${db_url_base}/workspaces/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    throw new Error("update todo request failed")
  }
  const json: WorkspaceApiResponse = await res.json()
  const ws_res: Workspace = {
    ...getWorkspaceDefaultValue(),
    id: json.id,
    name: json.name,
    ws_type: json.ws_type
  }
  return ws_res
}

export const deleteWorkspaceItem = async (id: number) => {
  const res = await fetch(`${db_url_base}/workspaces/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (!res.ok) {
    throw new Error("delete todo request failed")
  }
}
