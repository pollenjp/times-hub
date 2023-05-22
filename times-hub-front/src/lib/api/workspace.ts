import type { NewWorkspacePayload, Workspace } from "../../types/workspace"

// TODO: fix hard code url
const db_url_base = "http://localhost:3000"

export const addWorkspaceItem = async (payload: NewWorkspacePayload) => {
  const res = await fetch(`${db_url_base}/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error("Add request failed")
  }
  const json: Workspace = await res.json()
  return json
}

export const getWorkspaceItems = async () => {
  const res = await fetch(`${db_url_base}/workspaces`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) {
    throw new Error("get request failed")
  }
  const json: Workspace[] = await res.json()
  return json
}

export const updateWorkspaceItem = async (todo: Workspace) => {
  const { id, ...payload } = todo
  const res = await fetch(`${db_url_base}/workspaces/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error("update todo request failed")
  }
  const json: Workspace = await res.json()
  return json
}
