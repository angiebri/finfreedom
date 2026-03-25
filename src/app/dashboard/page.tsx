import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardShell from "@/components/layout/DashboardShell"

export default async function DashboardRoute() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  return <DashboardShell userEmail={user.email} />
}
