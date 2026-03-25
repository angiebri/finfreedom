"use client"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { FinanceState, HistoryRecord } from "@/types/finance"
import { genId } from "@/types/finance"

const DEFAULT_STATE: FinanceState = {
  income: {
    active: [
      { id: genId(), label: "Зарплата / найм", amount: 0, comment: "" },
      { id: genId(), label: "Трейдинг", amount: 0, comment: "" },
      { id: genId(), label: "Деньги от мужа / семьи", amount: 0, comment: "" },
    ],
    passive: [
      { id: genId(), label: "Аренда недвижимости", amount: 0, comment: "" },
      { id: genId(), label: "Дивиденды / акции", amount: 0, comment: "" },
      { id: genId(), label: "ИИС / облигации", amount: 0, comment: "" },
      { id: genId(), label: "Вклады (проценты)", amount: 0, comment: "" },
      { id: genId(), label: "Накопительные счета", amount: 0, comment: "" },
      { id: genId(), label: "Наличные доллары (доход)", amount: 0, comment: "" },
      { id: genId(), label: "Наличные евро (доход)", amount: 0, comment: "" },
      { id: genId(), label: "Доля в земле", amount: 0, comment: "" },
      { id: genId(), label: "Налоговый вычет", amount: 0, comment: "" },
    ],
  },
  expenses: [
    { id: genId(), label: "Ипотека / аренда жилья", amount: 0, comment: "", extra: "", category: "Жильё/ипотека" },
    { id: genId(), label: "Продукты / кафе", amount: 0, comment: "", extra: "", category: "Еда" },
    { id: genId(), label: "Транспорт", amount: 0, comment: "", extra: "", category: "Транспорт" },
    { id: genId(), label: "Взнос на инвестиции", amount: 0, comment: "", extra: "", category: "Инвестиции" },
    { id: genId(), label: "Подписки и сервисы", amount: 0, comment: "", extra: "", category: "Подписки" },
    { id: genId(), label: "Здоровье / спорт", amount: 0, comment: "", extra: "", category: "Здоровье" },
    { id: genId(), label: "Развлечения", amount: 0, comment: "", extra: "", category: "Развлечения" },
    { id: genId(), label: "Семья / дети", amount: 0, comment: "", extra: "", category: "Семья/дети" },
    { id: genId(), label: "Одежда / бьюти", amount: 0, comment: "", extra: "", category: "Одежда/бьюти" },
  ],
  banks: [
    { id: genId(), label: "Сбербанк", amount: 0, comment: "", extra: "", accountType: "bank" },
    { id: genId(), label: "Тинькофф / Т-Банк", amount: 0, comment: "", extra: "", accountType: "bank" },
    { id: genId(), label: "Брокерский счёт", amount: 0, comment: "", extra: "", accountType: "broker" },
    { id: genId(), label: "ИИС", amount: 0, comment: "", extra: "", accountType: "iis" },
  ],
  assets: [
    { id: genId(), label: "Наличные доллары ($)", amount: 0, comment: "Курс ~90 ₽/$", extra: "", assetType: "usd" },
    { id: genId(), label: "Наличные евро (€)", amount: 0, comment: "Курс ~98 ₽/€", extra: "", assetType: "eur" },
    { id: genId(), label: "Акции / фонды", amount: 0, comment: "", extra: "", assetType: "stocks" },
    { id: genId(), label: "ИИС (балансовая стоимость)", amount: 0, comment: "", extra: "", assetType: "iis" },
    { id: genId(), label: "Вклады (тело)", amount: 0, comment: "", extra: "", assetType: "deposit" },
    { id: genId(), label: "Накопительные счета (тело)", amount: 0, comment: "", extra: "", assetType: "saving" },
    { id: genId(), label: "Доля в земле", amount: 0, comment: "", extra: "", assetType: "realty" },
    { id: genId(), label: "Прочие активы", amount: 0, comment: "", extra: "", assetType: "other" },
  ],
  cushion: [
    { id: genId(), label: "Накопительный счёт Сбер", amount: 0, comment: "" },
  ],
  mortgage: {
    params: [
      { id: genId(), label: "Цена покупки, ₽", amount: 0, comment: "" },
      { id: genId(), label: "Рыночная стоимость, ₽", amount: 0, comment: "Дата оценки: __.__.____" },
      { id: genId(), label: "Первоначальный взнос (ПВ), ₽", amount: 0, comment: "" },
    ],
    loan: [
      { id: genId(), label: "Остаток долга по ипотеке, ₽", amount: 0, comment: "" },
      { id: genId(), label: "Ежемесячный платёж, ₽", amount: 0, comment: "" },
      { id: genId(), label: "Ставка, % годовых", amount: 0, comment: "" },
      { id: genId(), label: "Лет до закрытия", amount: 0, comment: "" },
    ],
    rent: [
      { id: genId(), label: "Аренда в месяц, ₽", amount: 0, comment: "Планируемая или текущая" },
      { id: genId(), label: "Доп. расходы в месяц, ₽", amount: 0, comment: "ЖКХ, управление" },
    ],
  },
}

export function useFinanceData() {
  const supabase = createClient()
  const [state, setState] = useState<FinanceState>(DEFAULT_STATE)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load state from Supabase
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: stateData } = await supabase
        .from("finance_state")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (stateData?.data) {
        setState(stateData.data as FinanceState)
      }

      const { data: histData } = await supabase
        .from("finance_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100)

      if (histData) setHistory(histData as HistoryRecord[])
      setLoading(false)
    }
    load()
  }, [])

  const saveState = useCallback(async (newState: FinanceState) => {
    setSaving(true)
    setState(newState)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    await supabase.from("finance_state").upsert({
      user_id: user.id,
      data: newState,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })

    // Calc totals for history
    const active = newState.income.active.reduce((s, r) => s + r.amount, 0)
    const passive = newState.income.passive.reduce((s, r) => s + r.amount, 0)
    const totalIncome = active + passive
    const totalExpenses = newState.expenses.reduce((s, r) => s + r.amount, 0)
    const banks = newState.banks.reduce((s, r) => s + r.amount, 0)
    const assets = newState.assets.reduce((s, r) => s + r.amount, 0)
    let mortgageEquity = 0
    if (newState.mortgage.params.length && newState.mortgage.loan.length) {
      const mkt = newState.mortgage.params.find(r => r.label.toLowerCase().includes("рыночн"))?.amount || 0
      const debt = newState.mortgage.loan.find(r => r.label.toLowerCase().includes("долг") || r.label.toLowerCase().includes("остат"))?.amount || 0
      mortgageEquity = Math.max(0, mkt - debt)
    }
    const totalCapital = banks + assets + mortgageEquity
    const cushionTotal = newState.cushion.reduce((s, r) => s + r.amount, 0)

    const { data: rec } = await supabase.from("finance_history").insert({
      user_id: user.id,
      active_income: active,
      passive_income: passive,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      delta: totalIncome - totalExpenses,
      total_capital: totalCapital,
      cushion_total: cushionTotal,
      snapshot: newState,
    }).select().single()

    if (rec) setHistory(prev => [rec as HistoryRecord, ...prev])
    setSaving(false)
  }, [supabase])

  return { state, setState, saveState, history, setHistory, loading, saving }
}
