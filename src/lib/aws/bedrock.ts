// Bedrock vision wrapper for ArtDex artwork recognition.
// Uses Claude Haiku 4.5 via the us. cross-region inference profile by default.
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const region = process.env.AWS_REGION ?? "us-east-1";
const modelId =
  process.env.BEDROCK_MODEL_ID ?? "us.anthropic.claude-haiku-4-5-20251001-v1:0";

let _client: BedrockRuntimeClient | null = null;
function client(): BedrockRuntimeClient {
  return (_client ??= new BedrockRuntimeClient({ region }));
}

/** Send a photo + recognition prompt to Claude; returns the raw text reply. */
export async function recognizeArtwork(
  imageBase64: string,
  mediaType: string,
  prompt: string
): Promise<string> {
  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          { type: "text", text: prompt },
        ],
      },
    ],
  };
  const res = await client().send(
    new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      body: JSON.stringify(body),
    })
  );
  const json = JSON.parse(new TextDecoder().decode(res.body));
  return json.content?.[0]?.text ?? "";
}
