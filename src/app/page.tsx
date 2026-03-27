import { redirect } from "next/navigation";

export default function RootPage() {
  // Proxy.ts handles the redirect; this page provides a fallback
  redirect("/en");
}
