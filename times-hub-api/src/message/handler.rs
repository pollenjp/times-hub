use crate::entity;
use crate::workspace::handler::{repository_error_to_status_code, ValidatedJson};
use crate::workspace::repository::WorkspaceRepository;
use ::axum::extract::Extension;
use ::axum::http::StatusCode;
use ::serde::Deserialize;
use ::serde::Serialize;
use ::std::collections::HashSet;
use ::std::sync::Arc;
use ::validator::Validate;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Validate)]
pub struct MessagePayload {
    pub targets: Vec<entity::WorkspaceId>,
    pub text: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SlackMessagePayload {
    pub text: String,
}

// TODO: ビジネスロジックの分離
pub async fn send_message<T>(
    Extension(repo): Extension<Arc<T>>,
    ValidatedJson(payload): ValidatedJson<MessagePayload>,
) -> StatusCode
where
    T: WorkspaceRepository,
{
    // db から一覧取得
    let r = repo.all().await.map_err(repository_error_to_status_code);
    let ws_vec;
    match r {
        Ok(w) => {
            ws_vec = w;
        }
        Err(e) => return e,
    }

    // 一覧から targets に含まれるものを抽出
    let mut targets = HashSet::new();
    for id in payload.targets {
        targets.insert(id);
    }

    let ws_vec = ws_vec
        .into_iter()
        .filter(|ws| targets.contains(&ws.id))
        .collect::<Vec<_>>();

    let payload_to_send = SlackMessagePayload { text: payload.text };

    for ws in ws_vec {
        tracing::info!("send to webhook: {}", ws.webhook_url);
        // send to webhook post request
        let client = reqwest::Client::new();
        let res = client
            .post(ws.webhook_url)
            .json(&payload_to_send)
            .send()
            .await
            .map_err(|e| {
                tracing::error!("error: {}", e);
                StatusCode::INTERNAL_SERVER_ERROR
            });
        match res {
            Ok(_) => {}
            Err(e) => {
                tracing::error!("error: {}", e);
            }
        }
    }

    StatusCode::OK
}
