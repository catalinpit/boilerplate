import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { redditMonitors, redditPosts, redditComments, monitorRuns } from "@/db/schema";
import { eq, desc, and, gte, count } from "drizzle-orm";
import MonitoringService from "@/lib/monitoring-service";

const monitoringService = MonitoringService.getInstance();

export const redditRouter = createTRPCRouter({
  // Create a new monitor
  createMonitor: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        subreddits: z.array(z.string().min(1)).min(1),
        keywords: z.array(z.string().min(1)).min(1),
        checkInterval: z.number().min(1).max(60).default(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [monitor] = await db
        .insert(redditMonitors)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      // Schedule the monitor if it's active by default
      monitoringService.scheduleMonitor(monitor.id, monitor.checkInterval);

      return monitor;
    }),

  // Get user's monitors
  getMonitors: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const monitors = await db
        .select()
        .from(redditMonitors)
        .where(eq(redditMonitors.userId, ctx.auth.user.id))
        .orderBy(desc(redditMonitors.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      // Add monitoring status
      const monitorsWithStatus = monitors.map((monitor) => ({
        ...monitor,
        isScheduled: monitoringService.isMonitorScheduled(monitor.id),
      }));

      return monitorsWithStatus;
    }),

  // Get single monitor details
  getMonitor: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const [monitor] = await db
        .select()
        .from(redditMonitors)
        .where(
          and(
            eq(redditMonitors.id, input.id),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        );

      if (!monitor) {
        throw new Error("Monitor not found");
      }

      return {
        ...monitor,
        isScheduled: monitoringService.isMonitorScheduled(monitor.id),
      };
    }),

  // Update monitor
  updateMonitor: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        subreddits: z.array(z.string().min(1)).optional(),
        keywords: z.array(z.string().min(1)).optional(),
        checkInterval: z.number().min(1).max(60).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      const [monitor] = await db
        .update(redditMonitors)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(redditMonitors.id, id),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!monitor) {
        throw new Error("Monitor not found");
      }

      // Update scheduling
      if (monitor.isActive && input.checkInterval) {
        monitoringService.scheduleMonitor(monitor.id, input.checkInterval);
      } else if (!monitor.isActive) {
        monitoringService.unscheduleMonitor(monitor.id);
      }

      return monitor;
    }),

  // Delete monitor
  deleteMonitor: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Unschedule first
      monitoringService.unscheduleMonitor(input.id);

      const [deletedMonitor] = await db
        .delete(redditMonitors)
        .where(
          and(
            eq(redditMonitors.id, input.id),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!deletedMonitor) {
        throw new Error("Monitor not found");
      }

      return { success: true };
    }),

  // Run monitor manually
  runMonitor: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const [monitor] = await db
        .select()
        .from(redditMonitors)
        .where(
          and(
            eq(redditMonitors.id, input.id),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        );

      if (!monitor) {
        throw new Error("Monitor not found");
      }

      const result = await monitoringService.runMonitor(input.id);
      return result;
    }),

  // Get monitor results (posts)
  getMonitorPosts: protectedProcedure
    .input(
      z.object({
        monitorId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify monitor ownership
      const [monitor] = await db
        .select()
        .from(redditMonitors)
        .where(
          and(
            eq(redditMonitors.id, input.monitorId),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        );

      if (!monitor) {
        throw new Error("Monitor not found");
      }

      const posts = await db
        .select()
        .from(redditPosts)
        .where(eq(redditPosts.monitorId, input.monitorId))
        .orderBy(desc(redditPosts.foundAt))
        .limit(input.limit)
        .offset(input.offset);

      return posts;
    }),

  // Get monitor results (comments)
  getMonitorComments: protectedProcedure
    .input(
      z.object({
        monitorId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify monitor ownership
      const [monitor] = await db
        .select()
        .from(redditMonitors)
        .where(
          and(
            eq(redditMonitors.id, input.monitorId),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        );

      if (!monitor) {
        throw new Error("Monitor not found");
      }

      const comments = await db
        .select()
        .from(redditComments)
        .where(eq(redditComments.monitorId, input.monitorId))
        .orderBy(desc(redditComments.foundAt))
        .limit(input.limit)
        .offset(input.offset);

      return comments;
    }),

  // Get monitor runs (execution history)
  getMonitorRuns: protectedProcedure
    .input(
      z.object({
        monitorId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // Verify monitor ownership
      const [monitor] = await db
        .select()
        .from(redditMonitors)
        .where(
          and(
            eq(redditMonitors.id, input.monitorId),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        );

      if (!monitor) {
        throw new Error("Monitor not found");
      }

      const runs = await db
        .select()
        .from(monitorRuns)
        .where(eq(monitorRuns.monitorId, input.monitorId))
        .orderBy(desc(monitorRuns.startedAt))
        .limit(input.limit)
        .offset(input.offset);

      return runs;
    }),

  // Get monitor stats
  getMonitorStats: protectedProcedure
    .input(z.object({ monitorId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Verify monitor ownership
      const [monitor] = await db
        .select()
        .from(redditMonitors)
        .where(
          and(
            eq(redditMonitors.id, input.monitorId),
            eq(redditMonitors.userId, ctx.auth.user.id)
          )
        );

      if (!monitor) {
        throw new Error("Monitor not found");
      }

      // Get counts
      const [postCount] = await db
        .select({ count: count() })
        .from(redditPosts)
        .where(eq(redditPosts.monitorId, input.monitorId));

      const [commentCount] = await db
        .select({ count: count() })
        .from(redditComments)
        .where(eq(redditComments.monitorId, input.monitorId));

      const [runCount] = await db
        .select({ count: count() })
        .from(monitorRuns)
        .where(eq(monitorRuns.monitorId, input.monitorId));

      // Get recent activity (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [recentPosts] = await db
        .select({ count: count() })
        .from(redditPosts)
        .where(
          and(
            eq(redditPosts.monitorId, input.monitorId),
            gte(redditPosts.foundAt, yesterday)
          )
        );

      const [recentComments] = await db
        .select({ count: count() })
        .from(redditComments)
        .where(
          and(
            eq(redditComments.monitorId, input.monitorId),
            gte(redditComments.foundAt, yesterday)
          )
        );

      return {
        totalPosts: postCount.count,
        totalComments: commentCount.count,
        totalRuns: runCount.count,
        recentPosts: recentPosts.count,
        recentComments: recentComments.count,
      };
    }),

  // Get dashboard stats (all monitors for user)
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    // Get user's monitors
    const userMonitors = await db
      .select({ id: redditMonitors.id })
      .from(redditMonitors)
      .where(eq(redditMonitors.userId, ctx.auth.user.id));

    const monitorIds = userMonitors.map((m) => m.id);

    if (monitorIds.length === 0) {
      return {
        totalMonitors: 0,
        activeMonitors: 0,
        totalPosts: 0,
        totalComments: 0,
        recentPosts: 0,
        recentComments: 0,
      };
    }

    // Get total counts
    const [totalPosts] = await db
      .select({ count: count() })
      .from(redditPosts)
      .where(eq(redditPosts.monitorId, monitorIds[0])); // This won't work for multiple monitors

    // Better approach - get all stats
    const activeMonitors = await db
      .select()
      .from(redditMonitors)
      .where(
        and(
          eq(redditMonitors.userId, ctx.auth.user.id),
          eq(redditMonitors.isActive, true)
        )
      );

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // This is a simplified version - in production you'd want more efficient queries
    let totalPosts = 0;
    let totalComments = 0;
    let recentPosts = 0;
    let recentComments = 0;

    for (const monitor of userMonitors) {
      const [posts] = await db
        .select({ count: count() })
        .from(redditPosts)
        .where(eq(redditPosts.monitorId, monitor.id));

      const [comments] = await db
        .select({ count: count() })
        .from(redditComments)
        .where(eq(redditComments.monitorId, monitor.id));

      const [recentPostsCount] = await db
        .select({ count: count() })
        .from(redditPosts)
        .where(
          and(
            eq(redditPosts.monitorId, monitor.id),
            gte(redditPosts.foundAt, yesterday)
          )
        );

      const [recentCommentsCount] = await db
        .select({ count: count() })
        .from(redditComments)
        .where(
          and(
            eq(redditComments.monitorId, monitor.id),
            gte(redditComments.foundAt, yesterday)
          )
        );

      totalPosts += posts.count;
      totalComments += comments.count;
      recentPosts += recentPostsCount.count;
      recentComments += recentCommentsCount.count;
    }

    return {
      totalMonitors: userMonitors.length,
      activeMonitors: activeMonitors.length,
      totalPosts,
      totalComments,
      recentPosts,
      recentComments,
    };
  }),
});