import { z } from "zod";

export const ZUploadUrlInputSchema = z.object({
  filename: z.string().min(4),
  contentType: z.string().min(4),
});

export type TUploadUrlInputType = z.infer<typeof ZUploadUrlInputSchema>;

export const ZDownloadUrlInputSchema = z.object({
  key: z.string(),
});

export type TDownloadUrlInputType = z.infer<typeof ZDownloadUrlInputSchema>;
