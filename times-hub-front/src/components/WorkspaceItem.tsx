import React from "react"
import type { Workspace } from "../types/workspace"
import { Typography, Button, Card, Grid, Stack, Checkbox } from "@mui/material"

type Props = {
  // メンバ変数
  todo: Workspace

  // `todos` に対する更新を行う際に呼び出す関数
  onUpdate: (todo: Workspace) => void

  // `todos` の要素を削除する際に呼び出す関数
  onDelete: (id: number) => void
}

const WorkspaceItem: React.FC<Props> = ({ todo: workspace, onUpdate, onDelete }) => {
  // const handleCheckbox = () => onUpdate({ ...workspace, checked: !checked })

  const handleDelete = () => onDelete(workspace.id)

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* <Grid item xs={1}>
          <Checkbox onChange={handleCheckbox} checked={checked}></Checkbox>
        </Grid> */}
        <Grid item xs={8}>
          <Stack spacing={1}>
            <Typography variant="caption" fontSize={16}>
              {workspace.name}
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
