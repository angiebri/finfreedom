"use client"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { X, LayoutDashboard, History, TrendingUp, TrendingDown, Building2, Gem, Home, LogOut } from "lucide-react"
import clsx from "clsx"

const NAV = [
  { section: "Обзор" },
  { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { id: "history", label: "История", icon: History },
  { section: "Внести данные" },
  { id: "income", label: "Доходы", icon: TrendingUp },
  { id: "expenses", label: "Расходы", icon: TrendingDown },
  { id: "banks", label: "Банки и счета", icon: Building2 },
  { id: "assets", label: "Активы", icon: Gem },
  { id: "mortgage", label: "Квартира / Ипотека", icon: Home },
]

interface Props {
  activePage: string
  onNavigate: (page: string) => void
  mobileOpen: boolean
  onClose: () => void
  userEmail?: string
}

export default function Sidebar({ activePage, onNavigate, mobileOpen, onClose, userEmail }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  function handleNav(id: string) {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 bottom-0 w-[230px] bg-ink z-50 flex flex-col",
          "transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          // Desktop: always visible
          "lg:translate-x-0",
          // Mobile: toggle
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top */}
        <div className="flex items-start justify-between px-5 py-5 border-b border-white/8">
          <div>
            <div className="font-serif text-white text-[17px] leading-tight">Личные финансы</div>
            <div className="text-[10px] font-normal text-white/35 tracking-[0.8px] uppercase mt-1">Путь к $1 000 000</div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md bg-white/10 text-white/60 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map((item, i) => {
            if ("section" in item) return (
              <div key={i} className="text-[9.5px] uppercase tracking-[1px] text-white/22 px-5 pt-4 pb-1">{item.section}</div>
            )
            const Icon = item.icon!
            const active = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id!)}
                className={clsx(
                  "w-full flex items-center gap-2.5 px-5 py-2.5 text-[13px] font-medium text-left",
                  "border-l-[3px] transition-all duration-150",
                  active
                    ? "text-white border-l-[#8fc4a4] bg-white/6"
                    : "text-white/48 border-transparent hover:text-white/82 hover:bg-white/4"
                )}
              >
                <Icon size={14} className="flex-shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-5 py-4 border-t border-white/8">
          {userEmail && (
            <div className="text-[11px] text-white/35 mb-2 truncate">{userEmail}</div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[12px] text-white/45 hover:text-white/80 transition-colors"
          >
            <LogOut size={13} />
            Выйти
          </button>
        </div>
      </aside>
    </>
  )
}
