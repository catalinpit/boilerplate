"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import Link from "next/link";

export default function MonitorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const monitorId = params.id as string;
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'runs' | 'settings'>('posts');

  const { data: monitor, isLoading: monitorLoading } = trpc.reddit.getMonitor.useQuery({ id: monitorId });
  const { data: stats, isLoading: statsLoading } = trpc.reddit.getMonitorStats.useQuery({ monitorId });
  const { data: posts, isLoading: postsLoading } = trpc.reddit.getMonitorPosts.useQuery({ monitorId });
  const { data: comments, isLoading: commentsLoading } = trpc.reddit.getMonitorComments.useQuery({ monitorId });
  const { data: runs, isLoading: runsLoading } = trpc.reddit.getMonitorRuns.useQuery({ monitorId });

  const runMonitorMutation = trpc.reddit.runMonitor.useMutation();
  const updateMonitorMutation = trpc.reddit.updateMonitor.useMutation();
  const deleteMonitorMutation = trpc.reddit.deleteMonitor.useMutation({
    onSuccess: () => {
      router.push('/reddit-monitor');
    },
  });

  if (monitorLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!monitor) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Monitor Not Found</h1>
          <p className="text-gray-600 mb-6">The monitor you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link
            href="/reddit-monitor"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Monitors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/reddit-monitor"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Monitors
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{monitor.name}</h1>
            <span className={`px-3 py-1 text-sm rounded-full ${
              monitor.isActive && monitor.isScheduled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {monitor.isActive && monitor.isScheduled ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => runMonitorMutation.mutate({ id: monitorId })}
              disabled={runMonitorMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {runMonitorMutation.isPending ? 'Running...' : 'Run Now'}
            </button>
            <button
              onClick={() => deleteMonitorMutation.mutate({ id: monitorId })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Monitor
            </button>
          </div>
        </div>

        {/* Description */}
        {monitor.description && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <p className="text-gray-700">{monitor.description}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts Found"
            value={stats?.totalPosts || 0}
            icon="📝"
            color="blue"
          />
          <StatCard
            title="Total Comments Found"
            value={stats?.totalComments || 0}
            icon="💬"
            color="green"
          />
          <StatCard
            title="Posts (24h)"
            value={stats?.recentPosts || 0}
            icon="🆕"
            color="yellow"
          />
          <StatCard
            title="Total Runs"
            value={stats?.totalRuns || 0}
            icon="🔄"
            color="purple"
          />
        </div>

        {/* Monitor Details */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Monitor Configuration</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Subreddits</h3>
                <div className="flex flex-wrap gap-2">
                  {monitor.subreddits.map((subreddit: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                      r/{subreddit}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {monitor.keywords.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Check Interval</h3>
                <p className="text-lg font-semibold text-gray-900">Every {monitor.checkInterval} minutes</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Created</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(monitor.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Last Checked</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {monitor.lastChecked 
                    ? new Date(monitor.lastChecked).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'posts', label: 'Posts', count: stats?.totalPosts || 0 },
                { id: 'comments', label: 'Comments', count: stats?.totalComments || 0 },
                { id: 'runs', label: 'Execution History', count: stats?.totalRuns || 0 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'posts' && (
              <PostsTab posts={posts} isLoading={postsLoading} />
            )}
            {activeTab === 'comments' && (
              <CommentsTab comments={comments} isLoading={commentsLoading} />
            )}
            {activeTab === 'runs' && (
              <RunsTab runs={runs} isLoading={runsLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: string; 
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} mr-4`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function PostsTab({ posts, isLoading }: { posts: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <p className="text-gray-500">No posts found yet. The monitor will find matching posts on its next run.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">
                <a 
                  href={post.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </a>
              </h3>
              
              {post.content && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {post.content.substring(0, 200)}...
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📍 r/{post.subreddit}</span>
                <span>👤 u/{post.author}</span>
                <span>⬆️ {post.score}</span>
                <span>💬 {post.numComments}</span>
                <span>🕒 {new Date(post.createdAt).toLocaleString()}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {post.matchedKeywords.map((keyword: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsTab({ comments, isLoading }: { comments: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">💬</div>
        <p className="text-gray-500">No comments found yet. The monitor will find matching comments on its next run.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-900 mb-3">
                <a 
                  href={comment.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  {comment.content}
                </a>
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📍 r/{comment.subreddit}</span>
                <span>👤 u/{comment.author}</span>
                <span>⬆️ {comment.score}</span>
                <span>🕒 {new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {comment.matchedKeywords.map((keyword: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RunsTab({ runs, isLoading }: { runs: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!runs || runs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">🔄</div>
        <p className="text-gray-500">No execution history yet. Run the monitor to see its execution history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {runs.map((run) => (
        <div key={run.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 text-xs rounded-full ${
                run.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : run.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {run.status}
              </span>
              <span className="text-sm text-gray-600">
                Started: {new Date(run.startedAt).toLocaleString()}
              </span>
              {run.completedAt && (
                <span className="text-sm text-gray-600">
                  Completed: {new Date(run.completedAt).toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-blue-600">📝 {run.postsFound} posts</span>
              <span className="text-green-600">💬 {run.commentsFound} comments</span>
            </div>
          </div>
          
          {run.errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {run.errorMessage}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}