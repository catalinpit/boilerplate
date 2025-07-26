"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import Link from "next/link";

export default function RedditMonitorPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: dashboardStats, isLoading: statsLoading } = trpc.reddit.getDashboardStats.useQuery();
  const { data: monitors, isLoading: monitorsLoading, refetch: refetchMonitors } = trpc.reddit.getMonitors.useQuery({});

  const createMonitorMutation = trpc.reddit.createMonitor.useMutation({
    onSuccess: () => {
      refetchMonitors();
      setShowCreateForm(false);
    },
  });

  const runMonitorMutation = trpc.reddit.runMonitor.useMutation({
    onSuccess: () => {
      refetchMonitors();
    },
  });

  const deleteMonitorMutation = trpc.reddit.deleteMonitor.useMutation({
    onSuccess: () => {
      refetchMonitors();
    },
  });

  if (statsLoading || monitorsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reddit Keyword Monitor</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Monitor
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Monitors"
            value={dashboardStats?.totalMonitors || 0}
            icon="📊"
          />
          <StatCard
            title="Active Monitors"
            value={dashboardStats?.activeMonitors || 0}
            icon="🔄"
          />
          <StatCard
            title="Posts Found (24h)"
            value={dashboardStats?.recentPosts || 0}
            icon="📝"
          />
          <StatCard
            title="Comments Found (24h)"
            value={dashboardStats?.recentComments || 0}
            icon="💬"
          />
        </div>

        {/* Monitors List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Monitors</h2>
          </div>
          
          {monitors && monitors.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {monitors.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  onRun={() => runMonitorMutation.mutate({ id: monitor.id })}
                  onDelete={() => deleteMonitorMutation.mutate({ id: monitor.id })}
                  isRunning={runMonitorMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📡</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No monitors yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first Reddit keyword monitor to get started.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Monitor
              </button>
            </div>
          )}
        </div>

        {/* Create Monitor Modal */}
        {showCreateForm && (
          <CreateMonitorModal
            onClose={() => setShowCreateForm(false)}
            onSubmit={(data) => createMonitorMutation.mutate(data)}
            isLoading={createMonitorMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function MonitorCard({ 
  monitor, 
  onRun, 
  onDelete, 
  isRunning 
}: { 
  monitor: any; 
  onRun: () => void; 
  onDelete: () => void; 
  isRunning: boolean;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{monitor.name}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              monitor.isActive && monitor.isScheduled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {monitor.isActive && monitor.isScheduled ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {monitor.description && (
            <p className="text-gray-600 mb-2">{monitor.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>📍 {monitor.subreddits.length} subreddit(s)</span>
            <span>🔍 {monitor.keywords.length} keyword(s)</span>
            <span>⏰ Every {monitor.checkInterval} minutes</span>
            {monitor.lastChecked && (
              <span>
                Last: {new Date(monitor.lastChecked).toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {monitor.keywords.slice(0, 3).map((keyword: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {keyword}
                </span>
              ))}
              {monitor.keywords.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{monitor.keywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Link
            href={`/reddit-monitor/${monitor.id}`}
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            View
          </Link>
          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isRunning ? 'Running...' : 'Run Now'}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateMonitorModal({ 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subreddits: '',
    keywords: '',
    checkInterval: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subreddits = formData.subreddits
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const keywords = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      subreddits,
      keywords,
      checkInterval: formData.checkInterval,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Monitor</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monitor Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Tech News Monitor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What is this monitor for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subreddits *
            </label>
            <input
              type="text"
              required
              value={formData.subreddits}
              onChange={(e) => setFormData({ ...formData, subreddits: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., technology, programming, startups (comma-separated)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter subreddit names separated by commas (without r/)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords *
            </label>
            <input
              type="text"
              required
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., artificial intelligence, machine learning, AI (comma-separated)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter keywords to search for, separated by commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check Interval (minutes)
            </label>
            <select
              value={formData.checkInterval}
              onChange={(e) => setFormData({ ...formData, checkInterval: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>Every 5 minutes</option>
              <option value={10}>Every 10 minutes</option>
              <option value={15}>Every 15 minutes</option>
              <option value={30}>Every 30 minutes</option>
              <option value={60}>Every hour</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}