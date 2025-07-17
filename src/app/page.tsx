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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {data?.user.name}!
            </h1>
            <p className="text-lg text-gray-600">Your application dashboard</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  Account Information
                </h3>
                <p className="text-blue-700">
                  <span className="font-medium">Email:</span> {data?.user.email}
                </p>
                <p className="text-blue-700">
                  <span className="font-medium">Name:</span> {data?.user.name}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Logout />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/demo-trpc"
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 rounded-lg p-2">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700">
                File Upload Demo
              </h3>
              <p className="text-gray-600 text-sm">
                Test TRPC integration with S3 file upload functionality
              </p>
            </Link>

            <Link
              href="/demo-trpc-protected"
              className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-green-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-600 rounded-lg p-2">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-700">
                Protected Route Demo
              </h3>
              <p className="text-gray-600 text-sm">
                Test protected TRPC endpoints with authentication
              </p>
            </Link>

            <Link
              href="/upload"
              className="group bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-purple-300"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-600 rounded-lg p-2">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700">
                Upload Page
              </h3>
              <p className="text-gray-600 text-sm">
                Direct file upload interface without TRPC
              </p>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Built with Next.js, TRPC, and Better Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
