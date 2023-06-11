import EditIcon from "@mui/icons-material/Edit"
import IconButton from "@mui/material/IconButton"
import React from "react"
import WorkspaceEditFormDialog from "./WorkspaceEditFormDialog"
import { Workspace } from "../types/workspace"


type Props = {
  onSubmit: (ws: Workspace) => void
  workspace: Workspace
}

const WorkspaceEditButton: React.FC<Props> = ({ onSubmit, workspace: ws }) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <IconButton aria-label="edit" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <WorkspaceEditFormDialog
        dialogOpenState={open}
        dialogHandleClose={handleClose}
        onSubmit={onSubmit}
        workspace={ws}
      ></WorkspaceEditFormDialog>
    </>
  )
}

export default WorkspaceEditButton
