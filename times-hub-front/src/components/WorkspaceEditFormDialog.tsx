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
import { SelectChangeEvent } from "@mui/material/Select"
import React from "react"
import WorkspaceFormItemName from "./FormItem/WorkspaceName"
import WorkspaceFormItemWebhookUrl from "./FormItem/WorkspaceWebhookUrl"
import { UpdateWorkspacePayload, Workspace } from "../types/workspace"


type Props = {
  dialogOpenState: boolean
  dialogHandleClose: () => void
  onSubmit: (ws: UpdateWorkspacePayload) => void
  workspace: Workspace
}

type WorkspaceIsError = {
  [K in keyof UpdateWorkspacePayload]: boolean
}

const WorkspaceEditFormDialog: React.FC<Props> = ({
  dialogOpenState,
  dialogHandleClose,
  onSubmit,
  workspace: ws
}) => {
  //////////////////////////////////////
  // Error state
  //////////////////////////////////////

  const defaultWorkspaceIsError: WorkspaceIsError = {
    id: false, // don't check because it is not editable
    name: false, // because init value is valid
    ws_type: false, // because select menu (普通のユーザーなら他の値を設定しようが無い)
    webhook_url: true // because init value is empty
  }

  // * editIsError can only be used in editIsErrorFromWorkspaceIsError
  const [isError, editIsError] = React.useState(true)
  const wsIsError: WorkspaceIsError = { ...defaultWorkspaceIsError }
  const editWsIsError = (key: keyof WorkspaceIsError, isError: boolean) => {
    wsIsError[key] = isError
    editIsError(Object.values(wsIsError).some((v) => v))
  }

  //////////////////////////////////////
  // Workspace state
  //////////////////////////////////////

  const [wsName, editWsName] = React.useState("")
  const onChangeWsName = React.useCallback(
    (value: string, isError: boolean): void => {
      editWsName(value)
      editWsIsError("name", isError)
    },
    [editWsName]
  )
  const [wsType, editWsType] = React.useState("slack")
  const onChangeWsType = React.useCallback(
    (e: SelectChangeEvent<string>): void => {
      editWsType(e.target.value)
      console.log(wsIsError)
      // skip validation because select menu
      // editWsIsError("ws_type", false)
      // editIsErrorFromWorkspaceIsError(workspaceIsError)
    },
    [editWsType]
  )
  const [wsWebhookUrl, editWsWebhookUrl] = React.useState("") // Empty because saved webhook_url should be secret.
  const onChangeWsWebhookUrl = React.useCallback(
    (value: string, isError: boolean): void => {
      editWsWebhookUrl(value)
      editWsIsError("webhook_url", isError)
    },
    [editWsWebhookUrl]
  )

  //////////////////////////////////////
  // メイン処理
  //////////////////////////////////////

  const editWorkspaceHandler = async () => {
    onSubmit({
      ...ws,
      id: ws.id, // not change
      name: wsName === "" ? ws.name : wsName,
      ws_type: wsType === "" ? ws.ws_type : wsType,
      webhook_url: wsWebhookUrl
    })
  }

  React.useEffect(() => {
    editWsName("")
    editWsType("slack")
    editWsWebhookUrl("")
    editIsError(true)
  }, [dialogOpenState])

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
              <WorkspaceFormItemName
                onChange={onChangeWsName}
                defaultValue={ws.name}
              ></WorkspaceFormItemName>
              <FormControl required variant="filled" fullWidth>
                <InputLabel id="workspace-type-menu-label">Workspace Type</InputLabel>
                <Select
                  labelId="workspace-type-menu-label"
                  id="workspace-type-menu"
                  label="Workspace Type"
                  defaultValue={ws.ws_type}
                  onChange={(e) => onChangeWsType(e)}
                >
                  <MenuItem value={"slack"}>Slack</MenuItem>
                  <MenuItem value={"discord"}>Discord</MenuItem>
                </Select>
                <FormHelperText>Note: Only support slack now.</FormHelperText>
              </FormControl>
              <WorkspaceFormItemWebhookUrl
                onChange={onChangeWsWebhookUrl}
              ></WorkspaceFormItemWebhookUrl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogHandleClose}>Cancel</Button>
        <Button
          disabled={isError}
          onClick={() => {
            // TODO: #11
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
