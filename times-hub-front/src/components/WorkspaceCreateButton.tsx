import { Button } from "@mui/material"
import React from "react"
import WorkspaceFormDialog from "./WorkspaceFormDialog"
import { NewWorkspacePayload } from "../types/workspace"


type Props = {
  onSubmit: (newTodo: NewWorkspacePayload) => void
}

const WorkspaceCreateButton: React.FC<Props> = ({ onSubmit }) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create a new workspace
      </Button>
      <WorkspaceFormDialog
        {...{
          onSubmit: onSubmit,
          dialogOpenState: open,
          dialogHandleClose: handleClose
        }}
      ></WorkspaceFormDialog>
    </>
  )
}

export default WorkspaceCreateButton
