use crate::entity::WorkspaceType;

use ::anyhow::Result;
use ::axum::async_trait;
use ::serde::Deserialize;
use ::serde::Serialize;
use ::thiserror::Error;

#[derive(Debug, Error)]
pub enum MessageError {
    #[error("Unexpected Error: {0}")]
    Unexpected(String),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SlackMessagePayload {
    pub text: String,
}

pub fn get_sender(
    ws_type: WorkspaceType,
    webhook_url: &str,
    text: &str,
) -> Result<impl Sender, MessageError> {
    match ws_type {
        WorkspaceType::Slack => Ok(SlackSender {
            webhook_url: webhook_url.to_string(),
            text: text.to_string(),
        }),
        // TODO: discord
        _ => Err(MessageError::Unexpected(format!("Unknown workspace type: {}", ws_type)).into()),
    }
}

#[async_trait]
pub trait Sender {
    async fn send(&self) -> Result<()>;
}

#[derive(Debug, Clone)]
pub struct SlackSender {
    webhook_url: String,
    text: String,
}

#[async_trait]
impl Sender for SlackSender {
    async fn send(&self) -> Result<()> {
        let payload = SlackMessagePayload {
            text: self.text.clone(),
        };

        reqwest::Client::new()
            .post(&self.webhook_url)
            .json(&payload)
            .send()
            .await
            .map_err(|e| {
                MessageError::Unexpected(format!("Failed to send message to webhook: {}", e))
            })?;
        Ok(())
    }
}
