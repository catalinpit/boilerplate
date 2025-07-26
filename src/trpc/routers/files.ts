import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { s3Client } from "@/lib/s3-client";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";

export const filesRouter = createTRPCRouter({
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(4),
        contentType: z.string().min(4),
      })
    )
    .mutation(async ({ input }) => {
      const { filename, contentType } = input;

      const uniqueFilename = `${filename}-${Date.now()}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFilename,
        ContentType: contentType,
      });

      try {
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 60 * 10,
        });

        return {
          uploadUrl: url,
          key: uniqueFilename,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL",
        });
      }
    }),
  getDownloadUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const { key } = input;

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
      });

      try {
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 60 * 10,
        });

        return url;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate download URL",
        });
      }
    }),
});
