import React from "react"
import type { Workspace } from "../types/workspace"
import { Stack, Typography } from "@mui/material"
import WorkspaceItem from "./WorkspaceItem"

type Props = {
  workspaces: Workspace[]

  onUpdate: (ws: Workspace) => void
  onDelete: (id: number) => void
}

const WorkspaceList: React.FC<Props> = ({ workspaces: todos, onUpdate, onDelete }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h2">Workspace List</Typography>
      <Stack spacing={2}>
        {todos.map((ws) => (
          <WorkspaceItem key={ws.id} todo={ws} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </Stack>
    </Stack>
  )
}

export default WorkspaceList
