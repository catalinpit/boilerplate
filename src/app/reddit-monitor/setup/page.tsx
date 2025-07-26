"use client";

import Link from "next/link";

export default function RedditSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/reddit-monitor"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Monitors
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Reddit API Setup</h1>
        </div>

        {/* Alert Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex">
            <div className="text-blue-500 text-xl mr-3">ℹ️</div>
            <div>
              <h3 className="text-blue-800 font-medium mb-2">Configuration Required</h3>
              <p className="text-blue-700">
                To use the Reddit monitoring features, you need to configure Reddit API credentials. 
                Follow the steps below to set up your Reddit application and obtain the necessary keys.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Create a Reddit Application
                </h2>
                <p className="text-gray-600 mb-4">
                  First, you need to create a Reddit application to get API credentials.
                </p>
                <div className="bg-gray-50 rounded p-4 mb-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Go to <a href="https://www.reddit.com/prefs/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Reddit App Preferences</a></li>
                    <li>Click "Create App" or "Create Another App"</li>
                    <li>Fill in the following details:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li><strong>Name:</strong> Your app name (e.g., "My Reddit Monitor")</li>
                        <li><strong>App type:</strong> Select "script"</li>
                        <li><strong>Description:</strong> Brief description of your monitoring tool</li>
                        <li><strong>About URL:</strong> Leave blank or use your website</li>
                        <li><strong>Redirect URI:</strong> http://localhost:3000 (not used but required)</li>
                      </ul>
                    </li>
                    <li>Click "Create app"</li>
                  </ol>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-yellow-800 text-sm">
                    📝 <strong>Note:</strong> Make sure to select "script" as the app type for server-side monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Get Your Credentials
                </h2>
                <p className="text-gray-600 mb-4">
                  After creating the app, you'll see your credentials on the apps page.
                </p>
                <div className="bg-gray-50 rounded p-4 mb-4">
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <strong>Client ID:</strong> This is the string of characters directly below your app name (looks like random characters)
                    </div>
                    <div>
                      <strong>Client Secret:</strong> This is labeled "secret" and is a longer string
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 text-sm">
                    🔒 <strong>Security:</strong> Never share your client secret publicly. Keep it secure!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Get a Refresh Token (Optional)
                </h2>
                <p className="text-gray-600 mb-4">
                  For automated monitoring, you'll need a refresh token. This can be obtained using your Reddit username and password.
                </p>
                <div className="bg-gray-50 rounded p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    You can generate a refresh token using tools like:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><a href="https://github.com/reddit-archive/reddit/wiki/OAuth2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Reddit OAuth2 Documentation</a></li>
                    <li>Reddit API testing tools</li>
                    <li>Manual OAuth2 flow implementation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Configure Environment Variables
                </h2>
                <p className="text-gray-600 mb-4">
                  Add your Reddit API credentials to your environment configuration.
                </p>
                <div className="bg-gray-900 rounded p-4 mb-4">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`# Add these to your .env.local file:

# Reddit API Configuration
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_REFRESH_TOKEN=your_refresh_token_here
REDDIT_USER_AGENT=your_app_name:v1.0.0 (by /u/yourusername)`}
                  </pre>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Tip:</strong> The user agent should follow Reddit's format: "platform:app_id:version (by /u/username)"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Test Your Setup
                </h2>
                <p className="text-gray-600 mb-4">
                  After configuring your credentials, restart your application and test the Reddit monitoring functionality.
                </p>
                <div className="bg-gray-50 rounded p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    Create a test monitor with a popular subreddit and common keywords to verify everything is working correctly.
                  </p>
                </div>
                <Link
                  href="/reddit-monitor"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Monitoring →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Understanding Reddit API Rate Limits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Free Tier Limits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 100 requests per minute with OAuth</li>
                <li>• 10 requests per minute without OAuth</li>
                <li>• Rate limits reset every minute</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Best Practices</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Monitor fewer subreddits initially</li>
                <li>• Use longer check intervals (5+ minutes)</li>
                <li>• Avoid running multiple monitors simultaneously</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://www.reddit.com/dev/api/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg mr-3">📚</span>
              <div>
                <div className="font-medium text-gray-900">Reddit API Documentation</div>
                <div className="text-sm text-gray-600">Official API reference</div>
              </div>
            </a>
            <a
              href="https://github.com/reddit-archive/reddit/wiki/OAuth2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg mr-3">🔐</span>
              <div>
                <div className="font-medium text-gray-900">OAuth2 Guide</div>
                <div className="text-sm text-gray-600">Authentication setup</div>
              </div>
            </a>
            <a
              href="https://www.reddit.com/r/redditdev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg mr-3">👥</span>
              <div>
                <div className="font-medium text-gray-900">r/redditdev</div>
                <div className="text-sm text-gray-600">Developer community</div>
              </div>
            </a>
            <a
              href="https://www.reddit.com/wiki/api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg mr-3">📖</span>
              <div>
                <div className="font-medium text-gray-900">API Terms & Rules</div>
                <div className="text-sm text-gray-600">Usage guidelines</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}