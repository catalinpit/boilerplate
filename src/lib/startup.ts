import RedditClient from './reddit';
import MonitoringService from './monitoring-service';

let isInitialized = false;

export async function initializeRedditMonitoring() {
  if (isInitialized) {
    console.log('Reddit monitoring already initialized');
    return;
  }

  try {
    // Get environment variables
    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET;
    const refreshToken = process.env.REDDIT_REFRESH_TOKEN;
    const userAgent = process.env.REDDIT_USER_AGENT || 'Reddit Monitor Tool:v1.0.0 (by /u/monitor)';

    // Check if we have the required credentials
    if (!clientId || !clientSecret) {
      console.warn('Reddit API credentials not configured. Monitoring features will be disabled.');
      console.warn('Please add REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET to your environment variables.');
      console.warn('See /reddit-monitor/setup for configuration instructions.');
      return;
    }

    console.log('Initializing Reddit client...');
    
    // Initialize Reddit client
    const redditClient = RedditClient.getInstance();
    redditClient.initialize({
      clientId,
      clientSecret,
      refreshToken: refreshToken || '',
      userAgent,
    });

    // Initialize monitoring service and start scheduled monitors
    const monitoringService = MonitoringService.getInstance();
    await monitoringService.initializeSchedules();

    isInitialized = true;
    console.log('Reddit monitoring initialized successfully');
    
    // Log configuration status
    console.log(`- Client ID: ${clientId ? '✓ Configured' : '✗ Missing'}`);
    console.log(`- Client Secret: ${clientSecret ? '✓ Configured' : '✗ Missing'}`);
    console.log(`- Refresh Token: ${refreshToken ? '✓ Configured' : '⚠ Optional (manual runs only)'}`);
    console.log(`- User Agent: ${userAgent}`);

  } catch (error) {
    console.error('Failed to initialize Reddit monitoring:', error);
    // Don't throw - let the app continue without monitoring
  }
}

export function getInitializationStatus() {
  return {
    isInitialized,
    hasClientId: !!process.env.REDDIT_CLIENT_ID,
    hasClientSecret: !!process.env.REDDIT_CLIENT_SECRET,
    hasRefreshToken: !!process.env.REDDIT_REFRESH_TOKEN,
  };
}