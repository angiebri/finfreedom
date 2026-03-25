"use client"
import { useState } from "react"
import type { FinanceState, ExpenseData } from "@/types/finance"
import { genId, EXPENSE_CATEGORIES } from "@/types/finance"
import DynamicRowComp from "@/components/forms/DynamicRow"
import ExpensePieChart from "@/components/charts/ExpensePieChart"
import { FormSection, PageHeader, Button, TotalRow, Card, CardHeader, CardBody } from "@/components/ui"
import { useToast } from "@/components/ui"

interface Props {
  state: FinanceState
  onSave: (s: FinanceState) => Promise<void>
  saving: boolean
  onNavigate: (p: string) => void
}

function makeExpRow(): ExpenseData {
  return { id: genId(), label: "", amount: 0, comment: "", extra: "", category: EXPENSE_CATEGORIES[0] }
}

export default function ExpensesPage({ state, onSave, saving, onNavigate }: Props) {
  const toast = useToast()
  const [rows, setRows] = useState<ExpenseData[]>(() => state.expenses.map(r => ({ ...r })))

  function update(id: string, field: keyof ExpenseData, value: unknown) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const total = rows.reduce((s, r) => s + r.amount, 0)

  async function handleSave() {
    await onSave({ ...state, expenses: rows })
    toast("✓ Расходы сохранены")
    onNavigate("dashboard")
  }

  const catOptions = EXPENSE_CATEGORIES.map(c => ({ v: c, l: c }))

  return (
    <div className="animate-fade-in">
      <PageHeader title="Расходы" subtitle="Добавляй статьи, выбирай категорию, вноси суммы" />

      <FormSection title="↓ Расходы за месяц" onAdd={() => setRows(prev => [...prev, makeExpRow()])} addLabel="Добавить статью">
        {rows.map(row => (
          <DynamicRowComp
            key={row.id}
            label={row.label} amount={row.amount} comment={row.comment} extra={row.category}
            extraLabel="Категория" extraOptions={catOptions}
            onLabelChange={v => update(row.id, "label", v)}
            onAmountChange={v => update(row.id, "amount", v)}
            onCommentChange={v => update(row.id, "comment", v)}
            onExtraChange={v => update(row.id, "category", v)}
            onRemove={() => setRows(prev => prev.filter(r => r.id !== row.id))}
          />
        ))}
        <TotalRow label="Итого расходов" value={new Intl.NumberFormat("ru-RU").format(total) + " ₽"} />
      </FormSection>

      {total > 0 && (
        <Card className="mb-4">
          <CardHeader title="Расходы по категориям" />
          <CardBody>
            <ExpensePieChart data={rows.map(r => ({ category: r.category, amount: r.amount }))} />
          </CardBody>
        </Card>
      )}

      <div className="flex gap-2.5 flex-wrap mt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Сохраняем…" : "✓ Сохранить расходы"}</Button>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>Отмена</Button>
      </div>
    </div>
  )
}
