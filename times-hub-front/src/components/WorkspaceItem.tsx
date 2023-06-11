import { Typography, Button, Card, Grid, Stack, Checkbox } from "@mui/material"
import React from "react"
import type { Workspace } from "../types/workspace"


type Props = {
  ws: Workspace
  onUpdate: (ws: Workspace) => void
  onDelete: (id: number) => void
  onChecked: (ws: Workspace) => void
}

const WorkspaceItem: React.FC<Props> = ({ ws, onUpdate, onDelete, onChecked }) => {
  const handleCheckbox = () => {
    onChecked(ws)
  }

  const handleUpdate = () => onDelete(ws.id)

  const handleDelete = () => onDelete(ws.id)

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1}>
          <Checkbox onChange={handleCheckbox} checked={ws.checked}></Checkbox>
        </Grid>
        <Grid item xs={8}>
          <Stack spacing={1}>
            <Typography variant="caption" fontSize={16}>
              {ws.name}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleDelete} color="error">
              delete
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  )
}

export default WorkspaceItem
