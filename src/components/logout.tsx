"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();

    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
