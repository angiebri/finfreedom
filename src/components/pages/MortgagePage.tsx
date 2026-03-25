"use client"
import { useState } from "react"
import type { FinanceState, DynamicRow } from "@/types/finance"
import { genId, formatRub } from "@/types/finance"
import DynamicRowComp from "@/components/forms/DynamicRow"
import { FormSection, PageHeader, Button, ProgressBar } from "@/components/ui"
import { useToast } from "@/components/ui"

interface Props {
  state: FinanceState
  onSave: (s: FinanceState) => Promise<void>
  saving: boolean
  onNavigate: (p: string) => void
}

interface MortResult {
  equity: number; eqPct: number; cf: number; roi: string
  buyP: number; mktP: number; gain: number; downP: number; debt: number
  rentI: number; paym: number; extra: number; paybackStr: string
}

function calcMort(params: DynamicRow[], loan: DynamicRow[], rent: DynamicRow[]): MortResult | null {
  const fv = (arr: DynamicRow[], kw: string) => arr.find(r => r.label.toLowerCase().includes(kw))?.amount || 0
  const buyP = fv(params, "покупк")
  const mktP = fv(params, "рыночн")
  const downP = fv(params, "взнос") || fv(params, "пв")
  const debt = fv(loan, "долг") || fv(loan, "остат")
  const paym = fv(loan, "платёж") || fv(loan, "платеж")
  const rentI = fv(rent, "аренд")
  const extra = fv(rent, "доп") || fv(rent, "расход")
  if (!buyP && !mktP) return null
  const equity = Math.max(0, mktP - debt)
  const eqPct = mktP ? Math.round(equity / mktP * 100) : 0
  const cf = rentI - paym - extra
  const roi = downP ? (rentI * 12 / downP * 100).toFixed(1) : "—"
  const pbM = cf > 0 && downP ? Math.ceil(downP / cf) : null
  const paybackStr = pbM ? (pbM > 12 ? Math.round(pbM / 12) + " лет" : pbM + " мес") : "не окупается"
  return { equity, eqPct, cf, roi, buyP, mktP, gain: mktP - buyP, downP, debt, rentI, paym, extra, paybackStr }
}

export default function MortgagePage({ state, onSave, saving, onNavigate }: Props) {
  const toast = useToast()
  const [params, setParams] = useState<DynamicRow[]>(() => state.mortgage.params.map(r => ({ ...r })))
  const [loan, setLoan] = useState<DynamicRow[]>(() => state.mortgage.loan.map(r => ({ ...r })))
  const [rent, setRent] = useState<DynamicRow[]>(() => state.mortgage.rent.map(r => ({ ...r })))
  const [result, setResult] = useState<MortResult | null>(() => calcMort(state.mortgage.params, state.mortgage.loan, state.mortgage.rent))

  function upd(setFn: (fn: (prev: DynamicRow[]) => DynamicRow[]) => void, id: string, field: keyof DynamicRow, value: unknown) {
    setFn(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  async function handleSave() {
    const newMort = { params, loan, rent }
    await onSave({ ...state, mortgage: newMort })
    setResult(calcMort(params, loan, rent))
    toast("✓ Квартира сохранена")
  }

  const tbl = (rows: [string, string, boolean?][]) => (
    <table className="w-full text-[12.5px] border-collapse">
      <tbody>
        {rows.map(([label, val, highlight], i) => (
          <tr key={i} className="border-b border-border last:border-0 hover:bg-surface2">
            <td className="py-2 px-3 text-ink2">{label}</td>
            <td className={`py-2 px-3 text-right font-semibold ${highlight === true ? "text-green" : highlight === false ? "text-red" : "text-ink"}`}>{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="animate-fade-in">
      <PageHeader title="Квартира / Ипотека" subtitle="Анализ объекта, аренды и окупаемости" />

      <FormSection title="⌂ Параметры квартиры" onAdd={() => setParams(prev => [...prev, { id: genId(), label: "", amount: 0, comment: "" }])} addLabel="Добавить поле">
        {params.map(row => (
          <DynamicRowComp key={row.id} label={row.label} amount={row.amount} comment={row.comment}
            onLabelChange={v => upd(setParams, row.id, "label", v)}
            onAmountChange={v => upd(setParams, row.id, "amount", v)}
            onCommentChange={v => upd(setParams, row.id, "comment", v)}
            onRemove={() => setParams(prev => prev.filter(r => r.id !== row.id))} />
        ))}
      </FormSection>

      <FormSection title="🏦 Параметры ипотеки" onAdd={() => setLoan(prev => [...prev, { id: genId(), label: "", amount: 0, comment: "" }])} addLabel="Добавить поле">
        {loan.map(row => (
          <DynamicRowComp key={row.id} label={row.label} amount={row.amount} comment={row.comment}
            onLabelChange={v => upd(setLoan, row.id, "label", v)}
            onAmountChange={v => upd(setLoan, row.id, "amount", v)}
            onCommentChange={v => upd(setLoan, row.id, "comment", v)}
            onRemove={() => setLoan(prev => prev.filter(r => r.id !== row.id))} />
        ))}
      </FormSection>

      <FormSection title="🔑 Аренда" onAdd={() => setRent(prev => [...prev, { id: genId(), label: "", amount: 0, comment: "" }])} addLabel="Добавить поле">
        {rent.map(row => (
          <DynamicRowComp key={row.id} label={row.label} amount={row.amount} comment={row.comment}
            onLabelChange={v => upd(setRent, row.id, "label", v)}
            onAmountChange={v => upd(setRent, row.id, "amount", v)}
            onCommentChange={v => upd(setRent, row.id, "comment", v)}
            onRemove={() => setRent(prev => prev.filter(r => r.id !== row.id))} />
        ))}
      </FormSection>

      <div className="flex gap-2.5 flex-wrap mb-6">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Считаем…" : "✓ Рассчитать и сохранить"}</Button>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>Отмена</Button>
      </div>

      {result && (
        <div className="bg-surface border border-border rounded-card shadow-card overflow-hidden animate-slide-in">
          <div className="bg-ink px-5 py-4">
            <div className="font-serif text-[17px] text-white">Анализ объекта</div>
          </div>
          <div className="p-5">
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { v: formatRub(result.equity), l: "Equity (твоя доля)" },
                { v: (result.cf >= 0 ? "+" : "") + new Intl.NumberFormat("ru-RU").format(result.cf) + " ₽", l: "Поток/мес", col: result.cf >= 0 ? "text-green" : "text-red" },
                { v: result.roi + "%", l: "ROI на ПВ / год" },
              ].map((item, i) => (
                <div key={i} className="text-center bg-surface2 border border-border rounded-[8px] p-3">
                  <div className={`font-serif text-[17px] mb-1 ${item.col || "text-ink"}`}>{item.v}</div>
                  <div className="text-[10px] text-ink3 uppercase tracking-[0.4px]">{item.l}</div>
                </div>
              ))}
            </div>

            {/* Equity bar */}
            <ProgressBar value={result.eqPct} color="green" height={9} />
            <div className="flex justify-between text-[11px] text-ink3 mt-1 mb-4">
              <span>Ваша доля: <b>{result.eqPct}%</b></span>
              <span>Долг: <b>{100 - result.eqPct}%</b></span>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface2 rounded-[8px] overflow-hidden border border-border">
                <div className="text-[11px] font-bold text-ink2 uppercase tracking-[0.5px] px-3 py-2 bg-surface border-b border-border">Финансы</div>
                {tbl([
                  ["Цена покупки", formatRub(result.buyP)],
                  ["Рыночная цена", formatRub(result.mktP)],
                  ["Прирост стоимости", (result.gain >= 0 ? "+" : "") + new Intl.NumberFormat("ru-RU").format(result.gain) + " ₽", result.gain >= 0],
                  ["Первоначальный взнос", formatRub(result.downP)],
                  ["Остаток долга", formatRub(result.debt)],
                ])}
              </div>
              <div className="bg-surface2 rounded-[8px] overflow-hidden border border-border">
                <div className="text-[11px] font-bold text-ink2 uppercase tracking-[0.5px] px-3 py-2 bg-surface border-b border-border">Аренда</div>
                {tbl([
                  ["Аренда / мес", formatRub(result.rentI), true],
                  ["Ипотека / мес", formatRub(result.paym), false],
                  ["Доп. расходы", formatRub(result.extra)],
                  ["Чистый поток / мес", (result.cf >= 0 ? "+" : "") + new Intl.NumberFormat("ru-RU").format(result.cf) + " ₽", result.cf >= 0],
                  ["Окупаемость ПВ", result.paybackStr],
                ])}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
