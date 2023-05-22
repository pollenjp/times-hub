import React from "react"
import { Box, Stack, Typography } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

import { Workspace, NewWorkspacePayload } from "./types/workspace"
import WorkspaceForm from "./components/WorkspaceForm"
import WorkspaceList from "./components/WorkspaceList"
import { addWorkspaceItem, getWorkspaceItems, updateWorkspaceItem } from "./lib/api/workspace"

import "./App.css"

const WorkspaceApp: React.FC = () => {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])

  const onSubmit = async (payload: NewWorkspacePayload) => {
    // TODO: validation check

    // todo の作成をサーバーに投げる
    await addWorkspaceItem(payload)

    // todo の作成に成功したら、サーバーから todo の一覧を取得する
    const workspaces = await getWorkspaceItems()
    setWorkspaces(workspaces)
  }

  const onUpdate = async (todo: Workspace) => {
    // TODO: implement
  }

  const onDelete = async (id: number) => {
    // TODO: implement
  }

  // 初期表示
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
          zIndex: 3,
        }}
      >
        <Typography variant="h1">times-hub App</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
          mt: 10,
        }}
      >
        <Box maxWidth={700} width="100%">
          <Stack spacing={5}>
            {/* TODO: Write Message and send request */}
            <WorkspaceList workspaces={workspaces} onUpdate={onUpdate} onDelete={onDelete} />
            <WorkspaceForm onSubmit={onSubmit} />
          </Stack>
        </Box>
      </Box>
    </>
  )
}

const theme = createTheme({
  typography: {
    h1: {
      fontsize: 30,
    },
    h2: {
      fontsize: 20,
    },
  },
})

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <WorkspaceApp />
    </ThemeProvider>
  )
}

export default App
