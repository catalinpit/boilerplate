"use client";;
import { useTRPC } from "@/trpc/client";

import { useQuery } from "@tanstack/react-query";

export default function DemoTrpcProtected() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.protected.queryOptions({ text: "world" }));
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
