import { initializeRedditMonitoring } from '@/lib/startup';

export default async function RedditMonitorInit() {
  // Initialize Reddit monitoring on server startup
  await initializeRedditMonitoring();
  
  return null; // This component doesn't render anything
}