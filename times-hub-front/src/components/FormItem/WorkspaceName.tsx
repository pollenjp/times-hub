import { TextField } from "@mui/material"
import React from "react"


type Props = {
  value: string
  onChange: (value: string, isError: boolean) => void
}

const workspaceFormItemNameFunc: React.FC<Props> = ({ value, onChange: onChangeParent }) => {
  const [editValue, setEditValue] = React.useState(value)
  const [isError, setIsError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const onChange = async (value: string) => {
    setEditValue(value)
    onChangeParent(value, !validateValue(value))
  }

  const validateValue = (value: string): boolean => {
    if (value.length === 0) {
      setIsError(true)
      setErrorMessage("ワークスペース名を入力してください。")
      return false
    }

    setIsError(false)
    return true
  }

  React.useEffect(() => {
    setEditValue(value)
    validateValue(value)
  }, [value])

  return (
    <TextField
      required
      label="Workspace Name"
      variant="filled"
      value={editValue}
      onChange={(e) => onChange(e.target.value)}
      error={isError}
      helperText={isError && errorMessage}
      fullWidth
    ></TextField>
  )
}

const WorkspaceFormItemName = React.memo(workspaceFormItemNameFunc)

export default WorkspaceFormItemName
