use crate::entity::WorkspaceType;

use ::anyhow::Result;
use ::axum::async_trait;
use ::serde::Deserialize;
use ::serde::Serialize;
use ::std::boxed::Box;
use ::thiserror::Error;

#[derive(Debug, Error)]
pub enum MessageError {
    #[error("Unexpected Error: {0}")]
    Unexpected(String),
}

pub fn get_sender(
    ws_type: WorkspaceType,
    webhook_url: &str,
    text: &str,
) -> Result<Box<dyn Sender>, MessageError> {
    match ws_type {
        WorkspaceType::Slack => {
            return Ok(Box::new(SlackSender::new(webhook_url, text)));
        }
        WorkspaceType::Discord => {
            return Ok(Box::new(DiscordSender::new(webhook_url, text)));
        } // _ => Err(MessageError::Unexpected(format!("Unknown workspace type: {}", ws_type)).into()),
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SlackMessagePayload {
    pub text: String,
}

#[async_trait]
pub trait Sender: Send + Sync {
    async fn send(&self) -> Result<()>;
}

#[derive(Debug, Clone)]
pub struct SlackSender {
    webhook_url: String,
    text: String,
}

impl SlackSender {
    pub fn new(webhook_url: &str, text: &str) -> Self {
        Self {
            webhook_url: webhook_url.to_string(),
            text: text.to_string(),
        }
    }
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

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct DiscordMessagePayload {
    pub content: String,
    pub username: String, // "pollenJP Webhook"
    pub avatar_url: String,
}

impl DiscordMessagePayload {
    pub fn new(text: &str) -> Self {
        Self {
            content: text.to_string(),
            // TODO: fix hard coded
            username: "pollenJP Webhook".to_string(),
            // TODO: fix hard coded
            avatar_url: "https://i.gyazo.com/e5b2988a9f6f05cafa4ec384fae1a3dd.png".to_string(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct DiscordSender {
    webhook_url: String,
    text: String,
}

impl DiscordSender {
    pub fn new(webhook_url: &str, text: &str) -> Self {
        Self {
            webhook_url: webhook_url.to_string(),
            text: text.to_string(),
        }
    }
}

#[async_trait]
impl Sender for DiscordSender {
    async fn send(&self) -> Result<()> {
        let payload = DiscordMessagePayload::new(&self.text);

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
