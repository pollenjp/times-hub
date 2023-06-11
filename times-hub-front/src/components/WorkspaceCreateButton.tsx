import { Button } from "@mui/material"
import React from "react"
import WorkspaceCreateFormDialog from "./WorkspaceCreateFormDialog"
import { WorkspacePayload } from "../types/workspace"


type Props = {
  onSubmit: (newTodo: WorkspacePayload) => void
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
      <WorkspaceCreateFormDialog
        onSubmit={onSubmit}
        dialogOpenState={open}
        dialogHandleClose={handleClose}
      ></WorkspaceCreateFormDialog>
    </>
  )
}

export default WorkspaceCreateButton
