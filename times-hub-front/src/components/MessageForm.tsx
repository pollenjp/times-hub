import React from "react"
import type { Workspace } from "../types/workspace"
import { Button, Grid, TextField, Paper, Box } from "@mui/material"

type Props = {
  checkedIDs: Set<number>
  onSubmit: () => void
}

const MessageItem: React.FC<Props> = ({ checkedIDs, onSubmit }) => {
  // const handleCheckbox = () => onUpdate({ ...workspace, checked: !checked })

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
              label="text"
              variant="filled"
              // value={editWebhookUrl}
              // onChange={(e) => setEditWebhookUrl(e.target.value)}
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={9}></Grid>
          <Grid item xs={3}>
            <Button
              // onClick={addWorkspaceHandler}
              fullWidth
            >
              send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default MessageItem
