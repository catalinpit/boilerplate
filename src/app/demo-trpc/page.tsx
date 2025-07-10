"use client";;
import { useTRPC } from "@/trpc/client";

import { useQuery } from "@tanstack/react-query";

export default function DemoTrpc() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: "world" }));
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
