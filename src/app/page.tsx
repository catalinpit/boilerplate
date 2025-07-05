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
    <div>
      {data?.user ? (
        <div>
          <h1>Welcome {data?.user.name}</h1>
          <Logout />
        </div>
      ) : (
        <div>
          <h1>Please login</h1>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </div>
      )}
    </div>
  );
}
