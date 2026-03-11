import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OUTLET_COOKIE } from "@/lib/demo-state";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(OUTLET_COOKIE);
  redirect("/sign-in");
}
