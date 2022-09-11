use tonic::{transport::Server, Request, Response, Status};

use rand::Rng;

use ade_ipsum::ade_ipsum_server::{AdeIpsum, AdeIpsumServer};
use ade_ipsum::bad_request::FieldViolation;
use ade_ipsum::ipsum_reply::Reply;
use ade_ipsum::{BadRequest, IpsumReply, IpsumRequest};

pub mod ade_ipsum {
    tonic::include_proto!("v1.adeipsum");
}

#[derive(Debug, Default)]
pub struct AdeIpsumImpl {}

#[tonic::async_trait]
impl AdeIpsum for AdeIpsumImpl {
    async fn generate_ipsum(
        &self,
        request: Request<IpsumRequest>,
    ) -> Result<Response<IpsumReply>, Status> {
        let number_of_sentences = request.into_inner().number_of_sentences;
        let mut field_violations: Vec<FieldViolation> = Vec::new();
        if number_of_sentences > 100 {
            field_violations.push(FieldViolation {
                field: "number_of_sentences".to_string(),
                description: "Number of sentences must be less than 100".to_string(),
            });
        }

        let reply = match field_violations.len() {
            0 => Reply::Content(Ipsum::generate(number_of_sentences)),
            _ => Reply::Errors(BadRequest {
                summary: "Unprocessable Entity".into(),
                field_violations,
            }),
        };

        Ok(Response::new(IpsumReply { reply: Some(reply) }))
    }
}

const IPSUM: &[&str] = &[
    "Good talk good talk.",
    "The server shit itself.",
    "What you saying?",
    "You like that don't you.",
    "That's what I'm talking about.",
    "That's sexy.",
];

#[derive(Debug, Default)]
pub struct Ipsum {}

impl Ipsum {
    pub fn generate(number_of_sentences: i32) -> String {
        let mut ipsum = String::new();
        let mut rng = rand::thread_rng();

        for i in 0..number_of_sentences {
            ipsum.push_str(IPSUM[rng.gen_range(0..IPSUM.len())]);
            if i != number_of_sentences {
                ipsum.push(' ');
            }
        }

        ipsum.into()
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;

    let adeipsum_service = tonic_web::enable(AdeIpsumServer::new(AdeIpsumImpl::default()));

    Server::builder()
        .accept_http1(true)
        .add_service(adeipsum_service)
        .serve(addr)
        .await?;

    Ok(())
}
