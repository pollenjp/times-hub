import { Box, Stack, Typography } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import React from "react"
import MessageForm from "./components/MessageForm"
import WorkspaceCreateButton from "./components/WorkspaceCreateButton"
import WorkspaceList from "./components/WorkspaceList"
import { sendMessage } from "./lib/api/message"
import { addWorkspaceItem, getWorkspaceItems, updateWorkspaceItem } from "./lib/api/workspace"
import { MessagePayload } from "./types/message"
import { Workspace, WorkspacePayload } from "./types/workspace"

import "./App.css"


const WorkspaceApp: React.FC = () => {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])
  const [checkedIDs, setCheckedIDs] = React.useState<Set<number>>(new Set())

  const onSubmit = async (payload: WorkspacePayload) => {
    // TODO: validation check

    await addWorkspaceItem(payload)

    const workspaces = await getWorkspaceItems()
    setWorkspaces(workspaces)
  }

  const onUpdate = async (ws: Workspace) => {
    await updateWorkspaceItem(ws)
    setWorkspaces(await getWorkspaceItems())
  }

  const onChecked = async (ws: Workspace) => {
    toggleChecked(ws.id)

    setWorkspaces(
      workspaces.map((workspace) => {
        if (workspace.id === ws.id) {
          return { ...workspace, checked: !workspace.checked }
        }
        return workspace
      })
    )
  }

  const toggleChecked = (id: number) => {
    if (checkedIDs.has(id)) {
      checkedIDs.delete(id)
    } else {
      checkedIDs.add(id)
    }
  }

  const onDelete = async (id: number) => {
    checkedIDs.delete(id)
    // TODO: API request: delete workspace
    throw new Error("Not implemented")
  }

  const onMessageSubmit = async (msg: MessagePayload) => {
    sendMessage(msg)
  }

  // 初期状態
  React.useEffect(() => {
    ;(async () => {
      setWorkspaces(await getWorkspaceItems())
      setCheckedIDs(new Set())
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
            <MessageForm checkedIDs={checkedIDs} onSubmit={onMessageSubmit}></MessageForm>
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
