import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRoleHome } from "@/lib/getRoleHome";
import Login from "@/components/Login";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getRoleHome(user));
  }

  return (
    <>
      <Login />
    </>
  );
}