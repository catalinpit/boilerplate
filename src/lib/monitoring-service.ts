import { db } from '@/db';
import { redditMonitors, redditPosts, redditComments, monitorRuns } from '@/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import RedditClient from './reddit';
import * as cron from 'node-cron';

export interface MonitorResult {
  postsFound: number;
  commentsFound: number;
  errors: string[];
}

class MonitoringService {
  private static instance: MonitoringService;
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map();
  private redditClient: RedditClient;

  private constructor() {
    this.redditClient = RedditClient.getInstance();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public async runMonitor(monitorId: string): Promise<MonitorResult> {
    const result: MonitorResult = {
      postsFound: 0,
      commentsFound: 0,
      errors: [],
    };

    // Create monitor run record
    const [monitorRun] = await db.insert(monitorRuns).values({
      monitorId,
      status: 'running',
    }).returning();

    try {
      // Get monitor details
      const [monitor] = await db
        .select()
        .from(redditMonitors)
        .where(eq(redditMonitors.id, monitorId));

      if (!monitor) {
        throw new Error(`Monitor ${monitorId} not found`);
      }

      if (!monitor.isActive) {
        throw new Error(`Monitor ${monitorId} is not active`);
      }

      // Process each subreddit
      for (const subreddit of monitor.subreddits) {
        try {
          // Monitor posts
          const postsResult = await this.monitorSubredditPosts(
            monitor.id,
            subreddit,
            monitor.keywords
          );
          result.postsFound += postsResult.found;

          // Monitor comments in new posts
          const commentsResult = await this.monitorSubredditComments(
            monitor.id,
            subreddit,
            monitor.keywords
          );
          result.commentsFound += commentsResult.found;

        } catch (error) {
          const errorMessage = `Error monitoring subreddit ${subreddit}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          console.error(errorMessage);
        }
      }

      // Update monitor last checked time
      await db
        .update(redditMonitors)
        .set({ lastChecked: new Date() })
        .where(eq(redditMonitors.id, monitorId));

      // Update monitor run record
      await db
        .update(monitorRuns)
        .set({
          status: 'completed',
          postsFound: result.postsFound,
          commentsFound: result.commentsFound,
          completedAt: new Date(),
          errorMessage: result.errors.length > 0 ? result.errors.join('; ') : null,
        })
        .where(eq(monitorRuns.id, monitorRun.id));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(errorMessage);

      // Update monitor run record with error
      await db
        .update(monitorRuns)
        .set({
          status: 'failed',
          completedAt: new Date(),
          errorMessage,
        })
        .where(eq(monitorRuns.id, monitorRun.id));
    }

    return result;
  }

  private async monitorSubredditPosts(
    monitorId: string,
    subreddit: string,
    keywords: string[]
  ): Promise<{ found: number }> {
    let found = 0;

    try {
      // Get new posts from the last hour to avoid duplicates
      const posts = await this.redditClient.getNewPosts(subreddit, 50);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      for (const post of posts) {
        const postData = this.redditClient.extractPostData(post);
        
        // Skip old posts
        if (postData.createdAt < oneHourAgo) {
          continue;
        }

        // Check if we already have this post
        const existingPost = await db
          .select()
          .from(redditPosts)
          .where(eq(redditPosts.redditId, postData.redditId))
          .limit(1);

        if (existingPost.length > 0) {
          continue;
        }

        // Check if post matches keywords
        const titleMatches = this.redditClient.matchesKeywords(postData.title, keywords);
        const contentMatches = this.redditClient.matchesKeywords(postData.content, keywords);
        const allMatches = [...new Set([...titleMatches, ...contentMatches])];

        if (allMatches.length > 0) {
          // Save matching post
          await db.insert(redditPosts).values({
            ...postData,
            matchedKeywords: allMatches,
            monitorId,
          });
          found++;
        }
      }
    } catch (error) {
      console.error(`Error monitoring posts in ${subreddit}:`, error);
      throw error;
    }

    return { found };
  }

  private async monitorSubredditComments(
    monitorId: string,
    subreddit: string,
    keywords: string[]
  ): Promise<{ found: number }> {
    let found = 0;

    try {
      // Get recent posts to check their comments
      const posts = await this.redditClient.getNewPosts(subreddit, 10);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      for (const post of posts) {
        try {
          const comments = await this.redditClient.getComments(post.id, 50);

          for (const comment of comments) {
            const commentData = this.redditClient.extractCommentData(comment, post.id);
            
            // Skip old comments
            if (commentData.createdAt < oneHourAgo) {
              continue;
            }

            // Check if we already have this comment
            const existingComment = await db
              .select()
              .from(redditComments)
              .where(eq(redditComments.redditId, commentData.redditId))
              .limit(1);

            if (existingComment.length > 0) {
              continue;
            }

            // Check if comment matches keywords
            const matches = this.redditClient.matchesKeywords(commentData.content, keywords);

            if (matches.length > 0) {
              // Save matching comment
              await db.insert(redditComments).values({
                ...commentData,
                matchedKeywords: matches,
                monitorId,
              });
              found++;
            }
          }
        } catch (error) {
          console.error(`Error checking comments for post ${post.id}:`, error);
          // Continue with other posts
        }
      }
    } catch (error) {
      console.error(`Error monitoring comments in ${subreddit}:`, error);
      throw error;
    }

    return { found };
  }

  public scheduleMonitor(monitorId: string, intervalMinutes: number): void {
    // Remove existing schedule if any
    this.unscheduleMonitor(monitorId);

    // Create cron expression for interval in minutes
    const cronExpression = `*/${intervalMinutes} * * * *`;

    const task = cron.schedule(cronExpression, async () => {
      console.log(`Running scheduled monitor ${monitorId}`);
      try {
        await this.runMonitor(monitorId);
        console.log(`Completed scheduled monitor ${monitorId}`);
      } catch (error) {
        console.error(`Error running scheduled monitor ${monitorId}:`, error);
      }
    }, {
      scheduled: false, // Don't start immediately
    });

    this.scheduledTasks.set(monitorId, task);
    task.start();
    
    console.log(`Scheduled monitor ${monitorId} to run every ${intervalMinutes} minutes`);
  }

  public unscheduleMonitor(monitorId: string): void {
    const task = this.scheduledTasks.get(monitorId);
    if (task) {
      task.stop();
      task.destroy();
      this.scheduledTasks.delete(monitorId);
      console.log(`Unscheduled monitor ${monitorId}`);
    }
  }

  public async initializeSchedules(): Promise<void> {
    try {
      // Get all active monitors
      const activeMonitors = await db
        .select()
        .from(redditMonitors)
        .where(eq(redditMonitors.isActive, true));

      console.log(`Initializing ${activeMonitors.length} active monitors`);

      for (const monitor of activeMonitors) {
        this.scheduleMonitor(monitor.id, monitor.checkInterval);
      }
    } catch (error) {
      console.error('Error initializing monitor schedules:', error);
    }
  }

  public getScheduledMonitors(): string[] {
    return Array.from(this.scheduledTasks.keys());
  }

  public isMonitorScheduled(monitorId: string): boolean {
    return this.scheduledTasks.has(monitorId);
  }
}

export default MonitoringService;