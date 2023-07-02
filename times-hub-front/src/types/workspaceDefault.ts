import clone from "clone"
import type { WorkspaceDefault } from "./workspace"


const workspaceDefaultValue: WorkspaceDefault = {
  checked: false
}

export const getWorkspaceDefaultValue = () => {
  return clone(workspaceDefaultValue)
}
