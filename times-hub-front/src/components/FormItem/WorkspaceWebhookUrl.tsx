import { TextField } from "@mui/material"
import React from "react"


type Props = {
  value: string
  onChange: (value: string, isError: boolean) => void
}

const workspaceFormItemWebhookUrlFunc: React.FC<Props> = ({ value, onChange: onChangeParent }) => {
  const [editValue, setEditValue] = React.useState(value)
  const [isError, setIsError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const onChange = async (value: string) => {
    setEditValue(value)
    onChangeParent(value, !validate(value))
  }

  const validate = (value: string): boolean => {
    if (value.length === 0) {
      setIsError(true)
      setErrorMessage("0文字以上の文字列を入力してください。")
      return false
    }

    setIsError(false)
    return true
  }

  React.useEffect(() => {
    setEditValue(value)
    validate(value)
  }, [value])

  return (
    <TextField
      required
      label="Webhook URL"
      variant="filled"
      value={editValue}
      onChange={(e) => onChange(e.target.value)}
      error={isError}
      helperText={isError && errorMessage}
      fullWidth
    ></TextField>
  )
}

const WorkspaceFormItemWebhookUrl = React.memo(workspaceFormItemWebhookUrlFunc)

export default WorkspaceFormItemWebhookUrl
