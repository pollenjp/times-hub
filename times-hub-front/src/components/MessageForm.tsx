import React from "react"
import type { Workspace } from "../types/workspace"
import { Button, Grid, TextField, Paper, Box } from "@mui/material"
import { MessagePayload } from "../types/message"

type Props = {
  checkedIDs: Set<number>
  onSubmit: (msg: MessagePayload) => void
}

const MessageItem: React.FC<Props> = ({ checkedIDs, onSubmit }) => {
  const [editText, setEditText] = React.useState("")

  const submitHandler = () => {
    const msg: MessagePayload = {
      targets: Array.from(checkedIDs.values()),
      text: editText,
    }
    onSubmit(msg)
    setEditText("")
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
              label="text"
              variant="filled"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={9}></Grid>
          <Grid item xs={3}>
            <Button onClick={submitHandler} fullWidth>
              send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default MessageItem
