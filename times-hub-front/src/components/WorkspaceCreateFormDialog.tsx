import {
  Box,
  Button,
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
import WorkspaceFormItemName from "./FormItem/WorkspaceName"
import WorkspaceFormItemWebhookUrl from "./FormItem/WorkspaceWebhookUrl"
import { WorkspacePayload } from "../types/workspace"


type OnSubmitCreate = (newTodo: WorkspacePayload) => void

type Props = {
  dialogOpenState: boolean
  dialogHandleClose: () => void
  onSubmit: OnSubmitCreate
}

/**
 * 全ての項目の validation をチェックし, ボタンの有効/無効を切り替える
 */
type WorkspaceIsError = {
  [K in keyof WorkspacePayload]: boolean
}

const WorkspaceCreateFormDialog: React.FC<Props> = ({
  dialogOpenState,
  dialogHandleClose,
  onSubmit
}) => {
  //////////////////////////////////////
  // Error state
  //////////////////////////////////////

  const defaultWorkspaceIsError = {
    name: true,
    ws_type: false, // because select menu
    webhook_url: true
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
  const [wsWebhookUrl, editWsWebhookUrl] = React.useState("")
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

  const addWorkspaceHandler = async () => {
    onSubmit({
      name: wsName,
      ws_type: wsType,
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
        <DialogContentText>新しいワークスペースを追加します。</DialogContentText>
        <Box
          sx={{
            p: 2
          }}
        >
          <Grid container rowSpacing={2} columnSpacing={5}>
            <Grid item xs={12}>
              <WorkspaceFormItemName onChange={onChangeWsName}></WorkspaceFormItemName>
              <FormControl required variant="filled" fullWidth>
                <InputLabel id="workspace-type-menu-label">Workspace Type</InputLabel>
                <Select
                  labelId="workspace-type-menu-label"
                  id="workspace-type-menu"
                  label="Workspace Type"
                  value={wsType}
                  onChange={(e) => onChangeWsType(e)}
                >
                  <MenuItem value={"slack"}>Slack</MenuItem>
                  <MenuItem value={"discord"}>Discord</MenuItem>
                  {/* <MenuItem value={"discord"}>Discord</MenuItem> */}
                </Select>
                <FormHelperText>Note: Only support slack now.</FormHelperText>
              </FormControl>
              <WorkspaceFormItemWebhookUrl
                onChange={onChangeWsWebhookUrl}
                defaultValue={wsWebhookUrl}
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
