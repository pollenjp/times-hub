import { Stack } from "@mui/material"
import React from "react"
import WorkspaceItem from "./WorkspaceItem"
import type { Workspace } from "../types/workspace"


type Props = {
  workspaces: Workspace[]

  onUpdate: (ws: Workspace) => void
  onDelete: (id: number) => void
  onChecked: (ws: Workspace) => void
}

const WorkspaceList: React.FC<Props> = ({ workspaces, onUpdate, onDelete, onChecked }) => {
  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        {workspaces.map((ws) => (
          <WorkspaceItem
            key={ws.id}
            ws={ws}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onChecked={onChecked}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default WorkspaceList
