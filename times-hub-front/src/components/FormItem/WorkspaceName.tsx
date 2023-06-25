import { TextField } from "@mui/material"
import React from "react"


type Props = {
  onChange: (value: string, isError: boolean) => void
  defaultValue?: string
}

const workspaceFormItemNameFunc: React.FC<Props> = ({
  onChange: onChangeParent,
  defaultValue = ""
}) => {
  const [isError, setIsError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const onChange = async (value: string) => {
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
    validateValue(defaultValue)
  }, [defaultValue])

  return (
    <>
      {console.log(defaultValue)}
      <TextField
        required
        label="Workspace Name"
        variant="filled"
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        error={isError}
        helperText={isError && errorMessage}
        fullWidth
      ></TextField>
    </>
  )
}

const WorkspaceFormItemName = React.memo(workspaceFormItemNameFunc)

export default WorkspaceFormItemName
