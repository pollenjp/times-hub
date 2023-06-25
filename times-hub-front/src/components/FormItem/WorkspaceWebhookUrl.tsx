import { TextField } from "@mui/material"
import React from "react"


type Props = {
  onChange: (value: string, isError: boolean) => void
  defaultValue?: string
}

const workspaceFormItemWebhookUrlFunc: React.FC<Props> = ({
  onChange: onChangeParent,
  defaultValue = ""
}) => {
  const [isError, setIsError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const onChange = async (value: string) => {
    onChangeParent(value, !validate(value))
  }

  const validate = (value: string): boolean => {
    if (value.length === 0) {
      setIsError(true)
      setErrorMessage("0文字以上の文字列を入力してください。")
      return false
    }

    if (!validateUrl(value)) {
      setIsError(true)
      setErrorMessage("URLが適切ではありません。")
      return false
    }

    setIsError(false)
    return true
  }

  React.useEffect(() => {
    validate(defaultValue)
  }, [defaultValue])

  return (
    <TextField
      required
      label="Webhook URL"
      variant="filled"
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      error={isError}
      helperText={isError && errorMessage}
      fullWidth
    ></TextField>
  )
}

const WorkspaceFormItemWebhookUrl = React.memo(workspaceFormItemWebhookUrlFunc)

export default WorkspaceFormItemWebhookUrl

const validateUrl = (url: string): boolean => {
  const urlRegExp = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?" + // port
      "(\\/[-a-z\\d%_.~+]*)*" + // path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  )
  return !!urlRegExp.test(url)
}
