"use client"
import { useMemo } from "react"
import type { FinanceState } from "@/types/finance"
import { BANK_ICONS, formatRub } from "@/types/finance"
import { StatCard, Card, CardHeader, CardBody, Badge, ProgressBar, EmptyState, PageHeader } from "@/components/ui"
import { Button } from "@/components/ui"

const GOAL_RUB = 90_000_000 // $1M × 90

interface Props {
  state: FinanceState
  onNavigate: (page: string) => void
}

export default function DashboardPage({ state, onNavigate }: Props) {
  const { income, expenses, banks, assets, cushion, mortgage } = state

  const activeIncome = useMemo(() => income.active.reduce((s, r) => s + r.amount, 0), [income])
  const passiveIncome = useMemo(() => income.passive.reduce((s, r) => s + r.amount, 0), [income])
  const totalIncome = activeIncome + passiveIncome
  const totalExpenses = useMemo(() => expenses.reduce((s, r) => s + r.amount, 0), [expenses])
  const delta = totalIncome - totalExpenses
  const totalCushion = useMemo(() => cushion.reduce((s, r) => s + r.amount, 0), [cushion])

  const capital = useMemo(() => {
    let t = banks.reduce((s, r) => s + r.amount, 0) + assets.reduce((s, r) => s + r.amount, 0)
    const mktRow = mortgage.params.find(r => r.label.toLowerCase().includes("рыночн"))
    const debtRow = mortgage.loan.find(r => r.label.toLowerCase().includes("долг") || r.label.toLowerCase().includes("остат"))
    if (mktRow && debtRow) t += Math.max(0, mktRow.amount - debtRow.amount)
    return t
  }, [banks, assets, mortgage])

  const capPct = GOAL_RUB > 0 ? Math.min(100, capital / GOAL_RUB * 100) : 0
  const expRatio = totalIncome > 0 ? Math.round(totalExpenses / totalIncome * 100) : 0
  const cushionMonths = totalExpenses > 0 ? (totalCushion / totalExpenses).toFixed(1) : "0"
  const cushionPct = Math.min(100, parseFloat(cushionMonths) / 6 * 100)
  const monthsToGoal = delta > 0 ? Math.ceil((GOAL_RUB - capital) / delta) : null
  const savingsRate = totalIncome > 0 ? Math.round(delta / totalIncome * 100) : 0
  const bankTotal = banks.reduce((s, r) => s + r.amount, 0)

  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Финансовый обзор"
        subtitle={`Обновлено: ${today}`}
        action={<Button onClick={() => onNavigate("income")} size="sm">+ Внести данные</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Общий капитал"
          value={formatRub(capital)}
          badge={`${capPct.toFixed(2)}% от $1M`}
          badgeVariant="gold"
        />
        <StatCard
          label="Доход / месяц"
          value={formatRub(totalIncome)}
          meta=""
          badge={activeIncome > 0 ? `Акт: ${formatRub(activeIncome)}` : undefined}
          badgeVariant="green"
        />
        <StatCard
          label="Расходы / месяц"
          value={formatRub(totalExpenses)}
          badge={`${expRatio}% дохода`}
          badgeVariant={expRatio > 75 ? "red" : expRatio > 50 ? "gold" : "green"}
        />
        <StatCard
          label="Дельта (свободные)"
          value={formatRub(delta)}
          badge={delta > 0 ? "→ инвестировать" : "⚠ дефицит"}
          badgeVariant={delta > 0 ? "green" : "red"}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Income breakdown — 2 cols wide */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader title="Структура доходов" />
            <CardBody>
              {[...income.active.map(r => ({ ...r, tp: "a" as const })), ...income.passive.map(r => ({ ...r, tp: "p" as const }))].filter(r => r.amount > 0).length === 0
                ? <EmptyState icon="◎" text="Нет данных — внесите доходы" />
                : [...income.active.map(r => ({ ...r, tp: "a" as const })), ...income.passive.map(r => ({ ...r, tp: "p" as const }))]
                    .filter(r => r.amount > 0)
                    .map(item => (
                      <div key={item.id} className="mb-3 last:mb-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 text-[12.5px] text-ink min-w-0">
                            <span className="truncate">{item.label}</span>
                            <Badge variant={item.tp === "a" ? "green" : "blue"}>
                              {item.tp === "a" ? "Актив" : "Пассив"}
                            </Badge>
                          </div>
                          <span className="font-bold text-[12.5px] ml-2 flex-shrink-0">{formatRub(item.amount)}</span>
                        </div>
                        <ProgressBar
                          value={totalIncome > 0 ? item.amount / totalIncome * 100 : 0}
                          color={item.tp === "a" ? "green" : "blue"}
                          height={4}
                        />
                      </div>
                    ))
              }
            </CardBody>
          </Card>

          {/* Passive breakdown */}
          <Card>
            <CardHeader title="Пассивный доход — источники" />
            <CardBody>
              {income.passive.filter(r => r.amount > 0).length === 0
                ? <EmptyState icon="◆" text="Нет данных — внесите пассивные доходы" />
                : <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {income.passive.filter(r => r.amount > 0).map(r => (
                      <div key={r.id} className="bg-surface2 border border-border rounded-[8px] p-3">
                        <div className="text-[10px] text-ink3 uppercase tracking-[0.4px] mb-1 truncate">{r.label}</div>
                        <div className="font-serif text-[16px] text-ink">{formatRub(r.amount)}</div>
                        {passiveIncome > 0 && (
                          <div className="text-[10px] text-ink3 mt-0.5">{Math.round(r.amount / passiveIncome * 100)}% пассива</div>
                        )}
                        {r.comment && <div className="text-[10px] text-ink2 mt-1 truncate">{r.comment}</div>}
                      </div>
                    ))}
                  </div>
              }
            </CardBody>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Focus block */}
          <div className="bg-green rounded-card p-5 text-white" style={{ background: "linear-gradient(135deg, #2a5c3f 0%, #1a3a28 100%)" }}>
            <div className="text-[10px] uppercase tracking-[1px] text-white/45 mb-2">🎯 Фокус</div>
            <div className="font-serif text-[19px] mb-3">Путь к $1 000 000</div>
            {[
              totalIncome > 0 && totalExpenses > 0
                ? `Норма сбережений: ${savingsRate}% — ${delta > 0 ? "продолжай!" : "снизи расходы"}`
                : "Внесите доходы и расходы",
              monthsToGoal
                ? `При дельте ${formatRub(delta)}/мес — цель через ${(monthsToGoal / 12).toFixed(1)} лет`
                : "Нужен положительный денежный поток",
              totalIncome > 0 && passiveIncome > 0
                ? `Пассивный доход: ${Math.round(passiveIncome / totalIncome * 100)}% — цель 50%+`
                : "Создавай пассивные источники",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8fc4a4] mt-2 flex-shrink-0" />
                <div className="text-[12px] text-white/80 leading-[1.45]">{text}</div>
              </div>
            ))}
          </div>

          {/* Cushion */}
          <div className="bg-surface border border-border rounded-card shadow-card p-4">
            <div className="text-[10px] uppercase tracking-[0.7px] text-ink3 font-semibold mb-1">Подушка безопасности</div>
            <div className="font-serif text-[22px] text-ink mb-2">{formatRub(totalCushion)}</div>
            <ProgressBar
              value={cushionPct}
              color={parseFloat(cushionMonths) >= 6 ? "green" : parseFloat(cushionMonths) >= 3 ? "gold" : "red"}
              height={7}
            />
            <div className="text-[11px] text-ink2 mt-1.5">
              {parseFloat(cushionMonths) > 0
                ? `${cushionMonths} мес. расходов`
                : "Рекомендуется 3–6 мес. расходов"}
            </div>
          </div>
        </div>
      </div>

      {/* Banks + Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Банки и счета"
            action={<button onClick={() => onNavigate("banks")} className="text-[11px] text-green font-semibold hover:underline">Изменить</button>}
          />
          <CardBody className="p-0">
            {banks.length === 0
              ? <EmptyState icon="▣" text="Добавьте банки и счета" />
              : <>
                  {banks.map(b => (
                    <div key={b.id} className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-0 hover:bg-surface2 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{BANK_ICONS[b.accountType] || "🏦"}</span>
                        <div>
                          <div className="text-[13px] font-semibold text-ink">{b.label || "—"}</div>
                          {b.comment && <div className="text-[11px] text-ink3">{b.comment}</div>}
                        </div>
                      </div>
                      <span className="font-bold text-[13px]">{formatRub(b.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-2.5 font-bold text-[13px] bg-surface2">
                    <span>Итого</span><span>{formatRub(bankTotal)}</span>
                  </div>
                </>
            }
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Вехи к $1 000 000" />
          <CardBody className="p-0">
            {[10, 25, 50, 75, 100].map(pct => {
              const target = GOAL_RUB * pct / 100
              const done = capital >= target
              const fill = Math.min(100, capital / target * 100)
              return (
                <div key={pct} className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0">
                  <div className={`font-serif text-[16px] w-10 flex-shrink-0 ${done ? "text-green" : "text-ink3"}`}>{pct}%</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-ink">${(target / 90 / 1000).toFixed(0)}k</div>
                    <ProgressBar value={fill} color={done ? "green" : "gold"} height={4} />
                    <div className="text-[10px] text-ink3 mt-0.5">{formatRub(target)}</div>
                  </div>
                  <span className="text-[15px]">{done ? "✓" : "○"}</span>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
