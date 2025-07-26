import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Logout from "@/components/logout";

export default async function Home() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {data?.user.name}!
            </h1>
            <p className="text-xl text-gray-600">
              Ready to monitor Reddit for insights?
            </p>
          </div>
          <Logout />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">📡</div>
              <div>
                <p className="text-sm text-gray-600">Active Monitors</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">📝</div>
              <div>
                <p className="text-sm text-gray-600">Posts Found</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">💬</div>
              <div>
                <p className="text-sm text-gray-600">Comments Found</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🎯</div>
              <div>
                <p className="text-sm text-gray-600">Keywords</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Reddit Monitor Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">📡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reddit Monitor</h3>
              <p className="text-gray-600 text-sm">
                Track keywords across multiple subreddits with automated monitoring
              </p>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Real-time keyword monitoring
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Multiple subreddit support
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Automated scheduling
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                Detailed analytics
              </div>
            </div>
            <Link
              href="/reddit-monitor"
              className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Open Reddit Monitor
            </Link>
          </div>

          {/* Setup Guide Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">API Setup</h3>
              <p className="text-gray-600 text-sm">
                Configure Reddit API credentials to enable monitoring
              </p>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-blue-500 mr-2">📋</span>
                Step-by-step guide
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-blue-500 mr-2">🔑</span>
                API key management
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-blue-500 mr-2">📊</span>
                Rate limit optimization
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-blue-500 mr-2">🛡️</span>
                Security best practices
              </div>
            </div>
            <Link
              href="/reddit-monitor/setup"
              className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Setup Guide
            </Link>
          </div>

          {/* API Demo Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">tRPC Demo</h3>
              <p className="text-gray-600 text-sm">
                Explore the type-safe API with live examples
              </p>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-purple-500 mr-2">⚡</span>
                End-to-end type safety
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-purple-500 mr-2">🔄</span>
                React Query integration
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-purple-500 mr-2">✅</span>
                Input validation
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-purple-500 mr-2">🛠️</span>
                Auto-completion
              </div>
            </div>
            <div className="space-y-2">
              <Link
                href="/demo-trpc"
                className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                Public Demo
              </Link>
              <Link
                href="/demo-trpc-protected"
                className="block w-full bg-purple-100 text-purple-700 text-center py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm"
              >
                Protected Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/reddit-monitor"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📱</span>
              <div>
                <div className="font-medium text-gray-900">Create Monitor</div>
                <div className="text-sm text-gray-600">Start monitoring Reddit</div>
              </div>
            </Link>
            
            <Link
              href="/reddit-monitor/setup"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔧</span>
              <div>
                <div className="font-medium text-gray-900">API Setup</div>
                <div className="text-sm text-gray-600">Configure credentials</div>
              </div>
            </Link>
            
            <Link
              href="/demo-trpc-protected"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🧪</span>
              <div>
                <div className="font-medium text-gray-900">Test API</div>
                <div className="text-sm text-gray-600">Try tRPC endpoints</div>
              </div>
            </Link>
            
            <a
              href="https://github.com/your-username/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📚</span>
              <div>
                <div className="font-medium text-gray-900">Documentation</div>
                <div className="text-sm text-gray-600">View source code</div>
              </div>
            </a>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Built With</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {[
              { name: 'Next.js', icon: '⚡' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'tRPC', icon: '🔗' },
              { name: 'Better Auth', icon: '🔐' },
              { name: 'Drizzle ORM', icon: '🗄️' },
              { name: 'PostgreSQL', icon: '🐘' },
              { name: 'Tailwind', icon: '🎨' },
              { name: 'Reddit API', icon: '📡' },
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-1">{tech.icon}</div>
                <div className="text-xs text-gray-600">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
