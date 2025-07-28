import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { filesRouter } from "./files/router";

export const appRouter = createTRPCRouter({
  files: filesRouter,
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  protected: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `protected hello ${opts.input.text} from user ${opts.ctx.auth.user.id}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
