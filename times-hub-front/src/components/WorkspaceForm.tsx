import React from "react"
import { NewWorkspacePayload } from "../types/workspace"
import { Box, Button, TextField, Paper, Grid } from "@mui/material"

type Props = {
  onSubmit: (newTodo: NewWorkspacePayload) => void
}

const WorkspaceForm: React.FC<Props> = ({ onSubmit }) => {
  const [editName, setEditName] = React.useState("")
  const [editWsType, setEditWsType] = React.useState("")
  const [editWebhookUrl, setEditWebhookUrl] = React.useState("")

  const addWorkspaceHandler = async () => {
    if (!editName) {
      return
    }

    onSubmit({
      name: editName,
      ws_type: editWsType,
      webhook_url: editWebhookUrl,
    })
    setEditName("")
    setEditWsType("")
    setEditWebhookUrl("")
  }

  return (
    <Paper elevation={2}>
      <Box
        sx={{
          p: 2,
        }}
      >
        <Grid container rowSpacing={2} columnSpacing={5}>
          <Grid item xs={12}>
            <TextField
              label="workspace name"
              variant="filled"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            ></TextField>
            <TextField
              label="only support 'slack' now"
              variant="filled"
              // テキストではなく、検索可能なプルダウンにしたい
              value={editWsType}
              onChange={(e) => setEditWsType(e.target.value)}
              fullWidth
            ></TextField>
            <TextField
              label="webhook url"
              variant="filled"
              value={editWebhookUrl}
              onChange={(e) => setEditWebhookUrl(e.target.value)}
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={9}></Grid>
          <Grid item xs={3}>
            <Button onClick={addWorkspaceHandler} fullWidth>
              Add Workspace
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default WorkspaceForm
