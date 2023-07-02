import { Button, Grid, TextField, Paper, Box } from "@mui/material"
import React from "react"


type Props = {
  onSubmit: (text: string) => void
}

const MessageItem: React.FC<Props> = ({ onSubmit }) => {
  const [editText, setEditText] = React.useState("")

  const submitHandler = () => {
    onSubmit(editText)
    setEditText("")
  }

  return (
    <Paper elevation={2}>
      <Box
        sx={{
          p: 2
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
