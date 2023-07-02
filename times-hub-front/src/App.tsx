import { Box, Stack, Typography } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import React from "react"
import MessageForm from "./components/MessageForm"
import WorkspaceCreateButton from "./components/WorkspaceCreateButton"
import WorkspaceList from "./components/WorkspaceList"
import { sendMessage } from "./lib/api/message"
import {
  addWorkspaceItem,
  getWorkspaceItems,
  updateWorkspaceItem,
  deleteWorkspaceItem
} from "./lib/api/workspace"
import { MessagePayload } from "./types/message"
import { Workspace, WorkspacePayload, UpdateWorkspacePayload } from "./types/workspace"

import "./App.css"


const WorkspaceApp: React.FC = () => {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])

  const onSubmit = async (payload: WorkspacePayload) => {
    // TODO: validation check

    await addWorkspaceItem(payload)

    const workspaces = await getWorkspaceItems()
    setWorkspaces(workspaces)
  }

  const onUpdate = async (ws: UpdateWorkspacePayload) => {
    await updateWorkspaceItem(ws)
    setWorkspaces(await getWorkspaceItems())
  }

  const onChecked = async (ws: Workspace) => {
    setWorkspaces(
      workspaces.map((w) => {
        if (w.id === ws.id) {
          return { ...w, checked: !w.checked }
        }
        return w
      })
    )
  }

  const onDelete = async (id: number) => {
    await deleteWorkspaceItem(id)
    setWorkspaces(await getWorkspaceItems())
  }

  const onMessageSubmit = async (text: string) => {
    const checkedIDs: Set<number> = new Set()
    // workspace.checked が true の場合は、checkedIDs に workspace.id を追加する
    workspaces.map((w) => w.checked && checkedIDs.add(w.id))

    const msg: MessagePayload = {
      targets: Array.from(checkedIDs),
      text
    }
    sendMessage(msg)
  }

  // 初期状態
  React.useEffect(() => {
    ;(async () => {
      setWorkspaces(await getWorkspaceItems())
    })()
  }, [])

  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid gray",
          display: "flex",
          alignItems: "center",
          position: "fixed",
          top: 0,
          p: 2,
          width: "100%",
          height: 80,
          zIndex: 3
        }}
      >
        <Typography variant="h1">times-hub App</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
          mt: 10
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h2">Message</Typography>
          <Stack spacing={2}>
            {/* <Typography>{checkedIDs}</Typography> */}
            <MessageForm onSubmit={onMessageSubmit}></MessageForm>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
          mt: 10
        }}
      >
        <Box maxWidth={700} width="100%">
          <Stack spacing={5}>
            <Typography variant="h2">Workspace List</Typography>
            <WorkspaceCreateButton onSubmit={onSubmit} />
            <WorkspaceList
              workspaces={workspaces}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onChecked={onChecked}
            />
          </Stack>
        </Box>
      </Box>
    </>
  )
}

const theme = createTheme({
  typography: {
    h1: {
      fontsize: 30
    },
    h2: {
      fontsize: 20
    }
  }
})

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <WorkspaceApp />
    </ThemeProvider>
  )
}

export default App
