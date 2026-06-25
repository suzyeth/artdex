// Shared AWS client config (region + credentials) for ArtDex.
//
// Vercel runs serverless functions on AWS Lambda, which RESERVES the names
// AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION — any values set under
// those names in the Vercel dashboard are shadowed at runtime by Lambda's own
// execution-role credentials (which have no DynamoDB/S3/Bedrock access), so the
// SDK silently authenticates as the wrong principal and every call 500s.
//
// To dodge the collision we read prefixed ARTDEX_AWS_* names in production.
// Locally those are unset, so we return no explicit credentials and the SDK falls
// back to the default chain (~/.aws/credentials) — preserving the dev workflow.

export interface AwsClientConfig {
  region: string;
  credentials?: { accessKeyId: string; secretAccessKey: string };
}

export function awsClientConfig(): AwsClientConfig {
  const region =
    process.env.ARTDEX_AWS_REGION ?? process.env.AWS_REGION ?? "us-east-1";
  const accessKeyId = process.env.ARTDEX_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.ARTDEX_AWS_SECRET_ACCESS_KEY;
  if (accessKeyId && secretAccessKey) {
    return { region, credentials: { accessKeyId, secretAccessKey } };
  }
  return { region };
}
