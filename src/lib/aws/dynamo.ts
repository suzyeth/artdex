// Shared DynamoDB Document client + table names for ArtDex.
// Region falls back to us-east-1; credentials come from the standard AWS chain
// (local: ~/.aws/credentials; Vercel: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env).
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const region = process.env.AWS_REGION ?? "us-east-1";

let _doc: DynamoDBDocumentClient | null = null;

export function ddb(): DynamoDBDocumentClient {
  if (!_doc) {
    const client = new DynamoDBClient({ region });
    _doc = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return _doc;
}

export const TABLES = {
  artists: "artdex_artists",
  museums: "artdex_museums",
  artworks: "artdex_artworks",
  exhibitions: "artdex_exhibitions",
  collections: "artdex_collections",
} as const;
