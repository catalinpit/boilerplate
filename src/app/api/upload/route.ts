import { s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: filename,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 10,
    });

    return Response.json({ url });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
