"use client"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { EXPENSE_CATEGORIES, EXPENSE_COLORS } from "@/types/finance"

interface Entry { category: string; amount: number }

export default function ExpensePieChart({ data }: { data: Entry[] }) {
  const grouped: Record<string, number> = {}
  data.forEach(d => {
    if (d.amount > 0) grouped[d.category] = (grouped[d.category] || 0) + d.amount
  })
  const entries = Object.entries(grouped).map(([name, value]) => ({ name, value }))
  const total = entries.reduce((s, e) => s + e.value, 0)

  if (!total) return (
    <div className="text-center py-6 text-ink3 text-[13px]">Нет данных для отображения</div>
  )

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="w-[180px] h-[180px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={entries} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" strokeWidth={2} stroke="#f8f7f3">
              {entries.map((entry) => {
                const idx = EXPENSE_CATEGORIES.indexOf(entry.name)
                return <Cell key={entry.name} fill={EXPENSE_COLORS[idx >= 0 ? idx : entries.indexOf(entry) % EXPENSE_COLORS.length]} />
              })}
            </Pie>
            <Tooltip
              formatter={(v: number) => [new Intl.NumberFormat("ru-RU").format(v) + " ₽", ""]}
              contentStyle={{ fontSize: 12, borderRadius: 7, border: "1px solid #e5e2da" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 w-full">
        {entries.map((entry) => {
          const idx = EXPENSE_CATEGORIES.indexOf(entry.name)
          const color = EXPENSE_COLORS[idx >= 0 ? idx : entries.indexOf(entry) % EXPENSE_COLORS.length]
          const pct = Math.round(entry.value / total * 100)
          return (
            <div key={entry.name} className="flex items-center gap-2 text-[12px]">
              <div className="w-2.5 h-2.5 rounded-[3px] flex-shrink-0" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-ink">{entry.name}</span>
              </div>
              <span className="text-ink2 tabular-nums">{new Intl.NumberFormat("ru-RU").format(entry.value)} ₽</span>
              <span className="text-ink3 w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
