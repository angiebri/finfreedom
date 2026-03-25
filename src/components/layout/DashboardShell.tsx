"use client"
import { useState } from "react"
import { Menu } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import { ToastProvider } from "@/components/ui"
import { useFinanceData } from "@/hooks/useFinanceData"
import DashboardPage from "@/components/pages/DashboardPage"
import IncomePage from "@/components/pages/IncomePage"
import ExpensesPage from "@/components/pages/ExpensesPage"
import BanksPage from "@/components/pages/BanksPage"
import AssetsPage from "@/components/pages/AssetsPage"
import MortgagePage from "@/components/pages/MortgagePage"
import HistoryPage from "@/components/pages/HistoryPage"

interface Props {
  userEmail?: string
}

export default function DashboardShell({ userEmail }: Props) {
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { state, saveState, history, setHistory, loading, saving } = useFinanceData()

  function handleNavigate(page: string) {
    setActivePage(page)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-2xl text-ink mb-2">Личные финансы</div>
        <div className="text-sm text-ink2">Загрузка данных…</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      <ToastProvider />

      {/* Sidebar — fixed left, always visible on lg+ */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userEmail={userEmail}
      />

      {/* Mobile topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-13 bg-ink z-30 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center justify-center w-9 h-9 text-white rounded-md hover:bg-white/10 transition-colors"
          aria-label="Открыть меню"
        >
          <Menu size={20} />
        </button>
        <div className="font-serif text-white text-[16px]">Личные финансы</div>
      </header>

      {/* Main content — offset by sidebar width on desktop */}
      <main className="lg:ml-[230px] min-h-screen">
        <div className="px-4 pt-16 pb-10 lg:px-8 lg:pt-8 max-w-[1200px]">
          {activePage === "dashboard" && (
            <DashboardPage state={state} onNavigate={handleNavigate} />
          )}
          {activePage === "income" && (
            <IncomePage state={state} onSave={saveState} saving={saving} onNavigate={handleNavigate} />
          )}
          {activePage === "expenses" && (
            <ExpensesPage state={state} onSave={saveState} saving={saving} onNavigate={handleNavigate} />
          )}
          {activePage === "banks" && (
            <BanksPage state={state} onSave={saveState} saving={saving} onNavigate={handleNavigate} />
          )}
          {activePage === "assets" && (
            <AssetsPage state={state} onSave={saveState} saving={saving} onNavigate={handleNavigate} />
          )}
          {activePage === "mortgage" && (
            <MortgagePage state={state} onSave={saveState} saving={saving} onNavigate={handleNavigate} />
          )}
          {activePage === "history" && (
            <HistoryPage history={history} setHistory={setHistory} />
          )}
        </div>
      </main>
    </div>
  )
}
