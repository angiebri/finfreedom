"use client"
import type { HistoryRecord } from "@/types/finance"
import { formatRub } from "@/types/finance"
import { PageHeader, Button, EmptyState } from "@/components/ui"
import { useToast } from "@/components/ui"
import { createClient } from "@/lib/supabase/client"

interface Props {
  history: HistoryRecord[]
  setHistory: (h: HistoryRecord[]) => void
}

export default function HistoryPage({ history, setHistory }: Props) {
  const toast = useToast()
  const supabase = createClient()

  async function clearHistory() {
    if (!confirm("Очистить всю историю?")) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from("finance_history").delete().eq("user_id", user.id)
    setHistory([])
    toast("История очищена")
  }

  function exportCSV() {
    if (!history.length) { toast("Нет данных для экспорта"); return }
    const headers = ["Дата", "Активный доход", "Пассивный доход", "Итого доход", "Расходы", "Дельта", "Капитал", "Подушка"]
    const rows = history.map(r => [
      new Date(r.created_at).toLocaleDateString("ru-RU"),
      r.active_income, r.passive_income, r.total_income,
      r.total_expenses, r.delta, r.total_capital, r.cushion_total,
    ])
    const csv = [headers, ...rows].map(r => r.join(";")).join("\n")
    const a = document.createElement("a")
    a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv)
    a.download = `finances_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    toast("✓ CSV экспортирован")
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="История записей"
        subtitle="Все сохранённые снимки финансового состояния"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={exportCSV}>↓ CSV</Button>
            <Button variant="danger" size="sm" onClick={clearHistory}>✕ Очистить</Button>
          </div>
        }
      />

      {history.length === 0
        ? <div className="bg-surface border border-border rounded-card shadow-card"><EmptyState icon="◎" text="Нет сохранённых записей" /></div>
        : (
          <div className="bg-surface border border-border rounded-card shadow-card overflow-x-auto">
            <table className="w-full text-[12.5px] border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface2 border-b border-border">
                  {["Дата", "Активный", "Пассивный", "Итого доход", "Расходы", "Дельта", "Капитал", "Подушка"].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-[10px] uppercase tracking-[0.6px] text-ink3 font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(r => {
                  const date = new Date(r.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })
                  return (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface2 transition-colors">
                      <td className="px-3 py-2.5 text-ink2 whitespace-nowrap">{date}</td>
                      <td className="px-3 py-2.5 tabular-nums">{new Intl.NumberFormat("ru-RU").format(r.active_income)}</td>
                      <td className="px-3 py-2.5 tabular-nums">{new Intl.NumberFormat("ru-RU").format(r.passive_income)}</td>
                      <td className="px-3 py-2.5 tabular-nums font-bold text-green">{new Intl.NumberFormat("ru-RU").format(r.total_income)}</td>
                      <td className="px-3 py-2.5 tabular-nums font-bold text-red">{new Intl.NumberFormat("ru-RU").format(r.total_expenses)}</td>
                      <td className={`px-3 py-2.5 tabular-nums font-bold ${r.delta >= 0 ? "text-green" : "text-red"}`}>
                        {(r.delta >= 0 ? "+" : "") + new Intl.NumberFormat("ru-RU").format(r.delta)}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">{new Intl.NumberFormat("ru-RU").format(r.total_capital)}</td>
                      <td className="px-3 py-2.5 tabular-nums">{new Intl.NumberFormat("ru-RU").format(r.cushion_total)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
