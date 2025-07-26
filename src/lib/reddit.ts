import Snoowrap from 'snoowrap';

// Reddit API client configuration
export interface RedditConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userAgent: string;
}

class RedditClient {
  private static instance: RedditClient;
  private snoowrap?: Snoowrap;

  private constructor() {}

  public static getInstance(): RedditClient {
    if (!RedditClient.instance) {
      RedditClient.instance = new RedditClient();
    }
    return RedditClient.instance;
  }

  public initialize(config: RedditConfig) {
    this.snoowrap = new Snoowrap({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken: config.refreshToken,
      userAgent: config.userAgent,
    });

    // Configure request delay to respect rate limits (1 request per second)
    this.snoowrap.config({
      requestDelay: 1100, // 1.1 seconds between requests
      warnings: false,
    });
  }

  public getClient(): Snoowrap {
    if (!this.snoowrap) {
      throw new Error('Reddit client not initialized. Call initialize() first.');
    }
    return this.snoowrap;
  }

  public async searchSubreddit(
    subreddit: string,
    keywords: string[],
    options: {
      sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
      time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
      limit?: number;
    } = {}
  ) {
    if (!this.snoowrap) {
      throw new Error('Reddit client not initialized');
    }

    const { sort = 'new', time = 'day', limit = 25 } = options;
    const query = keywords.join(' OR ');

    try {
      const results = await this.snoowrap
        .getSubreddit(subreddit)
        .search({
          query,
          sort,
          time,
          limit,
        });

      return results;
    } catch (error) {
      console.error(`Error searching subreddit ${subreddit}:`, error);
      throw error;
    }
  }

  public async getNewPosts(
    subreddit: string,
    limit: number = 25
  ) {
    if (!this.snoowrap) {
      throw new Error('Reddit client not initialized');
    }

    try {
      const posts = await this.snoowrap
        .getSubreddit(subreddit)
        .getNew({ limit });

      return posts;
    } catch (error) {
      console.error(`Error getting new posts from ${subreddit}:`, error);
      throw error;
    }
  }

  public async getComments(
    postId: string,
    limit: number = 100
  ) {
    if (!this.snoowrap) {
      throw new Error('Reddit client not initialized');
    }

    try {
      const submission = await this.snoowrap.getSubmission(postId);
      const comments = await submission.comments;
      
      // Flatten all comments (including replies)
      const flatComments: any[] = [];
      
      const extractComments = (commentList: any[]) => {
        for (const comment of commentList) {
          if (comment.body && comment.body !== '[deleted]' && comment.body !== '[removed]') {
            flatComments.push(comment);
          }
          if (comment.replies && comment.replies.length > 0) {
            extractComments(comment.replies);
          }
        }
      };

      extractComments(comments);
      return flatComments.slice(0, limit);
    } catch (error) {
      console.error(`Error getting comments for post ${postId}:`, error);
      throw error;
    }
  }

  public matchesKeywords(text: string, keywords: string[]): string[] {
    const matchedKeywords: string[] = [];
    const lowerText = text.toLowerCase();

    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();
      if (lowerText.includes(lowerKeyword)) {
        matchedKeywords.push(keyword);
      }
    }

    return matchedKeywords;
  }

  public extractPostData(post: any) {
    return {
      redditId: post.id,
      title: post.title || '',
      content: post.selftext || post.url || '',
      author: post.author ? post.author.name : '[deleted]',
      subreddit: post.subreddit.display_name,
      url: post.url || '',
      permalink: `https://reddit.com${post.permalink}`,
      score: post.score || 0,
      numComments: post.num_comments || 0,
      isNsfw: post.over_18 || false,
      createdAt: new Date(post.created_utc * 1000),
    };
  }

  public extractCommentData(comment: any, postId: string) {
    return {
      redditId: comment.id,
      content: comment.body || '',
      author: comment.author ? comment.author.name : '[deleted]',
      subreddit: comment.subreddit.display_name,
      postId,
      permalink: `https://reddit.com${comment.permalink}`,
      score: comment.score || 0,
      isNsfw: comment.over_18 || false,
      createdAt: new Date(comment.created_utc * 1000),
    };
  }
}

export default RedditClient;