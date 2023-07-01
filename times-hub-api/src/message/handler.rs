use crate::entity;
use crate::message::service::get_sender;
use crate::message::service::Sender;
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

// TODO: ビジネスロジックの分離
pub fn send_message<T>(
    Extension(repo): Extension<Arc<T>>,
    ValidatedJson(payload): ValidatedJson<MessagePayload>,
) -> impl std::future::Future<Output = StatusCode> + Send + 'static
where
    T: WorkspaceRepository,
{
    async move {
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

        let ws_vec: Vec<entity::Workspace> = ws_vec
            .into_iter()
            .filter(|ws| targets.contains(&ws.id))
            .collect::<Vec<_>>();

        let mut err_msgs: Vec<String> = vec![];

        for ws in ws_vec {
            tracing::info!("send to webhook");

            let sender: Arc<Box<dyn Sender>>;
            match get_sender(ws.ws_type, ws.webhook_url.as_str(), payload.text.as_str()) {
                Ok(s) => {
                    sender = Arc::new(s);
                }
                Err(e) => {
                    err_msgs.push(e.to_string());
                    continue;
                }
            }

            match sender.send().await {
                Ok(_) => {
                    tracing::info!("success");
                }
                Err(e) => {
                    err_msgs.push(e.to_string());
                }
            }
        }

        // TODO: エラーの詳細を返す
        if err_msgs.len() > 0 {
            tracing::error!("error: {:?}", err_msgs);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }

        StatusCode::OK
    }
}
