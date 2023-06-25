import DeleteIcon from "@mui/icons-material/Delete"
import { Typography, Card, Grid, Stack, Checkbox } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import React from "react"
import WorkspaceEditButton from "./WorkspaceEditButton"
import type { Workspace, UpdateWorkspacePayload } from "../types/workspace"


type Props = {
  ws: Workspace
  onUpdate: (ws: UpdateWorkspacePayload) => void
  onDelete: (id: number) => void
  onChecked: (ws: Workspace) => void
}

const WorkspaceItem: React.FC<Props> = ({ ws, onUpdate, onDelete, onChecked }) => {
  const handleCheckbox = () => {
    onChecked(ws)
  }

  const handleDelete = () => onDelete(ws.id)

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1}>
          <Checkbox onChange={handleCheckbox} checked={ws.checked}></Checkbox>
        </Grid>
        <Grid item xs={9}>
          <Stack spacing={1}>
            <Typography variant="caption" fontSize={16}>
              {ws.name}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={1}>
          <Stack direction="row" spacing={1}>
            <WorkspaceEditButton onSubmit={onUpdate} workspace={ws} />
          </Stack>
        </Grid>
        <Grid item xs={1}>
          <Stack direction="row" spacing={1}>
            <IconButton color="error" aria-label="delete" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  )
}

export default WorkspaceItem
