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
import { WorkspacePayload, Workspace } from "../types/workspace"


type OnSubmitCreate = (newTodo: WorkspacePayload) => void

type Props = {
  dialogOpenState: boolean
  dialogHandleClose: () => void
  onSubmit: OnSubmitCreate
}

const WorkspaceCreateFormDialog: React.FC<Props> = ({
  dialogOpenState,
  dialogHandleClose,
  onSubmit
}) => {
  const defaultWorkspace = {
    name: "",
    ws_type: "slack",
    webhook_url: ""
  } as WorkspacePayload
  const [editWorkspace, setEditWorkspace] = React.useState(defaultWorkspace)

  const addWorkspaceHandler = async () => {
    // TODO: validation

    onSubmit(editWorkspace)
    setEditWorkspace(defaultWorkspace)
  }

  React.useEffect(() => {
    setEditWorkspace(defaultWorkspace)
  }, [dialogOpenState])

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
                // value={editName}
                value={editWorkspace.name}
                onChange={(e) =>
                  setEditWorkspace({
                    ...editWorkspace,
                    name: e.target.value
                  })
                }
                fullWidth
              ></TextField>
              <FormControl required variant="filled" fullWidth>
                <InputLabel id="workspace-type-menu-label">Workspace Type</InputLabel>
                <Select
                  labelId="workspace-type-menu-label"
                  id="workspace-type-menu"
                  label="Workspace Type"
                  value={editWorkspace.ws_type}
                  onChange={(e) =>
                    setEditWorkspace({
                      ...editWorkspace,
                      ws_type: e.target.value
                    })
                  }
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
                value={editWorkspace.webhook_url}
                onChange={(e) =>
                  setEditWorkspace({
                    ...editWorkspace,
                    webhook_url: e.target.value
                  })
                }
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

export default WorkspaceCreateFormDialog
