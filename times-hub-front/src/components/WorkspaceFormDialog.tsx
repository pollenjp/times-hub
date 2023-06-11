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
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import React from "react"
import { NewWorkspacePayload } from "../types/workspace"


type Props = {
  onSubmit: (newTodo: NewWorkspacePayload) => void
  dialogOpenState: boolean
  dialogHandleClose: () => void
}

const WorkspaceFormDialog: React.FC<Props> = ({ onSubmit, dialogOpenState, dialogHandleClose }) => {
  const [editName, setEditName] = React.useState("")
  const [editWsType, setEditWsType] = React.useState("slack")
  const [editWebhookUrl, setEditWebhookUrl] = React.useState("")

  const handleWorkspaceTypeMenuChange = (event: SelectChangeEvent) => {
    setEditWsType(event.target.value as string)
  }

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
                label="Workspace Name"
                variant="filled"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
              ></TextField>
              <FormControl required variant="filled" fullWidth>
                <InputLabel id="workspace-type-menu-label">Workspace Type</InputLabel>
                <Select
                  labelId="workspace-type-menu-label"
                  id="workspace-type-menu"
                  value={editWsType}
                  label="Workspace Type"
                  onChange={handleWorkspaceTypeMenuChange}
                >
                  <MenuItem value={"slack"}>Slack</MenuItem>
                  {/* <MenuItem value={"discord"}>Discord</MenuItem> */}
                </Select>
                <FormHelperText>Note: Only support slack now.</FormHelperText>
              </FormControl>
              <TextField
                required
                label="Webhook URL"
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
