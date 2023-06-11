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
import Select from "@mui/material/Select"
import React from "react"
import { Workspace } from "../types/workspace"


type Props = {
  dialogOpenState: boolean
  dialogHandleClose: () => void
  onSubmit: (ws: Workspace) => void
  workspace: Workspace
}

const WorkspaceEditFormDialog: React.FC<Props> = ({
  dialogOpenState,
  dialogHandleClose,
  onSubmit,
  workspace: ws
}) => {
  const [editName, setEditName] = React.useState("")
  const defaultWsType = "slack"
  const [editWsType, setEditWsType] = React.useState(defaultWsType)
  const [editWebhookUrl, setEditWebhookUrl] = React.useState("")

  const setWorkspaceState = (w: Workspace) => {
    setEditName(w.name)
    setEditWsType(w.ws_type)
    setEditWebhookUrl(w.webhook_url)
  }

  const editWorkspaceHandler = async () => {
    // TODO: validation

    const newWorkspace: Workspace = {
      ...ws,
      name: editName,
      ws_type: editWsType,
      webhook_url: editWebhookUrl
    }
    onSubmit(newWorkspace)
    setWorkspaceState(newWorkspace)
  }

  React.useEffect(() => {
    setWorkspaceState(ws)
  }, [ws])

  return (
    <Dialog open={dialogOpenState} onClose={dialogHandleClose}>
      <DialogTitle>Workspace</DialogTitle>
      <DialogContent>
        <DialogContentText>ワークスペースを編集します。</DialogContentText>
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
                  onChange={(e) => setEditWsType(e.target.value as string)}
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
            editWorkspaceHandler()
          }}
        >
          Edit workspace
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WorkspaceEditFormDialog
