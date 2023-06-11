// TODO: fix hard code url
const db_url_base = "http://localhost:3000"

type MessagePayload = {
  targets: number[]
  text: string
}

export const sendMessage = async (payload: MessagePayload) => {
  const res = await fetch(`${db_url_base}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    throw new Error("Send an message failed")
  }
}
