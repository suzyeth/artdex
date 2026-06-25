// S3 presigned URLs for ArtDex selfie uploads/display. Objects stay private;
// the browser uploads via a short-lived PUT url and views via a GET url.
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { awsClientConfig } from "./credentials";

const bucket = process.env.S3_BUCKET ?? "artdex-images-525033346195";

let _s3: S3Client | null = null;
function s3(): S3Client {
  return (_s3 ??= new S3Client(awsClientConfig()));
}

/** Short-lived URL the browser uses to PUT a selfie directly to S3. */
export async function presignedPutUrl(key: string, contentType: string): Promise<string> {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: 300 }
  );
}

/** Short-lived URL to display a stored selfie. */
export async function presignedGetUrl(key: string): Promise<string> {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: 3600,
  });
}
