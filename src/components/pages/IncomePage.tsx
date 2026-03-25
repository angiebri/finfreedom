"use client"
import { useState } from "react"
import type { FinanceState, DynamicRow } from "@/types/finance"
import { genId } from "@/types/finance"
import DynamicRowComp from "@/components/forms/DynamicRow"
import { FormSection, PageHeader, Button, TotalRow } from "@/components/ui"
import { useToast } from "@/components/ui"

interface Props {
  state: FinanceState
  onSave: (s: FinanceState) => Promise<void>
  saving: boolean
  onNavigate: (p: string) => void
}

function makeRow(label = "", amount = 0, comment = ""): DynamicRow {
  return { id: genId(), label, amount, comment }
}

export default function IncomePage({ state, onSave, saving, onNavigate }: Props) {
  const toast = useToast()
  const [active, setActive] = useState<DynamicRow[]>(() =>
    state.income.active.map(r => ({ ...r }))
  )
  const [passive, setPassive] = useState<DynamicRow[]>(() =>
    state.income.passive.map(r => ({ ...r }))
  )

  function updateRow(rows: DynamicRow[], setRows: (r: DynamicRow[]) => void, id: string, field: keyof DynamicRow, value: unknown) {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }
  function removeRow(rows: DynamicRow[], setRows: (r: DynamicRow[]) => void, id: string) {
    setRows(rows.filter(r => r.id !== id))
  }

  const totalActive = active.reduce((s, r) => s + r.amount, 0)
  const totalPassive = passive.reduce((s, r) => s + r.amount, 0)

  async function handleSave() {
    await onSave({ ...state, income: { active, passive } })
    toast("✓ Доходы сохранены")
    onNavigate("dashboard")
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Доходы" subtitle="Редактируй названия, добавляй поля и комментарии" />

      <FormSection title="↑ Активный доход" onAdd={() => setActive(prev => [...prev, makeRow()])} addLabel="Добавить поле">
        {active.map(row => (
          <DynamicRowComp
            key={row.id}
            label={row.label} amount={row.amount} comment={row.comment}
            onLabelChange={v => updateRow(active, setActive, row.id, "label", v)}
            onAmountChange={v => updateRow(active, setActive, row.id, "amount", v)}
            onCommentChange={v => updateRow(active, setActive, row.id, "comment", v)}
            onRemove={() => removeRow(active, setActive, row.id)}
          />
        ))}
        <TotalRow label="Итого активный доход" value={new Intl.NumberFormat("ru-RU").format(totalActive) + " ₽"} />
      </FormSection>

      <FormSection title="◆ Пассивный доход" onAdd={() => setPassive(prev => [...prev, makeRow()])} addLabel="Добавить поле">
        {passive.map(row => (
          <DynamicRowComp
            key={row.id}
            label={row.label} amount={row.amount} comment={row.comment}
            onLabelChange={v => updateRow(passive, setPassive, row.id, "label", v)}
            onAmountChange={v => updateRow(passive, setPassive, row.id, "amount", v)}
            onCommentChange={v => updateRow(passive, setPassive, row.id, "comment", v)}
            onRemove={() => removeRow(passive, setPassive, row.id)}
          />
        ))}
        <TotalRow label="Итого пассивный доход" value={new Intl.NumberFormat("ru-RU").format(totalPassive) + " ₽"} />
      </FormSection>

      <div className="flex gap-2.5 flex-wrap mt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Сохраняем…" : "✓ Сохранить доходы"}</Button>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>Отмена</Button>
      </div>
    </div>
  )
}
