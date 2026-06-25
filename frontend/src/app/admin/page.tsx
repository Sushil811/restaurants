import { redirect } from "next/navigation";

/**
 * /admin root — redirects straight to the dashboard.
 * This prevents a 404 when navigating to /admin directly.
 */
export default function AdminRootPage() {
  redirect("/admin/dashboard");
}
