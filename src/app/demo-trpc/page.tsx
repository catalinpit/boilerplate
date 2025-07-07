"use client";

import { trpc } from "@/trpc/client";

export default function DemoTrpc() {
  const greeting = trpc.hello.useQuery({ text: "world" });
  if (greeting.isLoading) {
    return <div>Loading...</div>;
  }
  if (greeting.isError) {
    return <div>Error: {greeting.error.message}</div>;
  }
  return (
    <div>
      <h1>Demo TRPC</h1>
      <p>{greeting.data?.greeting}</p>
    </div>
  );
}
