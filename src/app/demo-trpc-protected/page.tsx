"use client";

import { trpc } from "@/trpc/client";

export default function DemoTrpcProtected() {
  const greeting = trpc.protected.useQuery({ text: "world" });
  if (greeting.isLoading) {
    return <div>Loading...</div>;
  }
  if (greeting.isError) {
    return <div>Error: {greeting.error.message}</div>;
  }
  return (
    <div>
      <h1>Demo TRPC Protected</h1>
      <p>{greeting.data?.greeting}</p>
    </div>
  );
}
