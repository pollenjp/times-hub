import {
  Box,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material"
import React from "react"
import { NewWorkspacePayload } from "../types/workspace"


type Props = {
  onSubmit: (newTodo: NewWorkspacePayload) => void
  dialogOpenState: boolean
  dialogHandleClose: () => void
}

const WorkspaceFormDialog: React.FC<Props> = ({ onSubmit, dialogOpenState, dialogHandleClose }) => {
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
      webhook_url: editWebhookUrl
    })
    setEditName("")
    setEditWsType("")
    setEditWebhookUrl("")
  }

  return (
    <Dialog open={dialogOpenState} onClose={dialogHandleClose}>
      <DialogTitle>Workspace</DialogTitle>
      <DialogContent>
        <DialogContentText>新しいワークスペースを追加します。</DialogContentText>
        <Box
          sx={{
            p: 2
          }}
        >
          <Grid container rowSpacing={2} columnSpacing={5}>
            <Grid item xs={12}>
              <TextField
                required
                label="workspace name"
                variant="filled"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
              ></TextField>
              <TextField
                // TODO: テキストではなく、検索可能なプルダウンにしたい
                required
                label="workspace type (only support 'slack' now)"
                variant="filled"
                value={editWsType}
                onChange={(e) => setEditWsType(e.target.value)}
                fullWidth
              ></TextField>
              <TextField
                required
                label="webhook url"
                variant="filled"
                value={editWebhookUrl}
                onChange={(e) => setEditWebhookUrl(e.target.value)}
                fullWidth
              ></TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogHandleClose}>Cancel</Button>
        <Button
          onClick={() => {
            dialogHandleClose()
            addWorkspaceHandler()
          }}
        >
          Add workspace
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WorkspaceFormDialog
