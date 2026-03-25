"use client"
import { useState } from "react"
import type { FinanceState, BankAccount } from "@/types/finance"
import { genId, BANK_TYPES } from "@/types/finance"
import DynamicRowComp from "@/components/forms/DynamicRow"
import { FormSection, PageHeader, Button, TotalRow } from "@/components/ui"
import { useToast } from "@/components/ui"

interface Props {
  state: FinanceState
  onSave: (s: FinanceState) => Promise<void>
  saving: boolean
  onNavigate: (p: string) => void
}

function makeRow(): BankAccount {
  return { id: genId(), label: "", amount: 0, comment: "", extra: "", accountType: "bank" }
}

export default function BanksPage({ state, onSave, saving, onNavigate }: Props) {
  const toast = useToast()
  const [rows, setRows] = useState<BankAccount[]>(() => state.banks.map(r => ({ ...r })))

  function update(id: string, field: keyof BankAccount, value: unknown) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const total = rows.reduce((s, r) => s + r.amount, 0)

  async function handleSave() {
    await onSave({ ...state, banks: rows })
    toast("✓ Банки сохранены")
    onNavigate("dashboard")
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Банки и счета" subtitle="Добавляй счета, брокеров, ИИС, кошельки — и вноси актуальные остатки" />

      <FormSection title="▣ Все счета" onAdd={() => setRows(prev => [...prev, makeRow()])} addLabel="Добавить счёт">
        {rows.map(row => (
          <DynamicRowComp
            key={row.id}
            label={row.label} amount={row.amount} comment={row.comment} extra={row.accountType}
            extraLabel="Тип счёта" extraOptions={BANK_TYPES}
            onLabelChange={v => update(row.id, "label", v)}
            onAmountChange={v => update(row.id, "amount", v)}
            onCommentChange={v => update(row.id, "comment", v)}
            onExtraChange={v => update(row.id, "accountType", v)}
            onRemove={() => setRows(prev => prev.filter(r => r.id !== row.id))}
          />
        ))}
        <TotalRow label="Итого по всем счетам" value={new Intl.NumberFormat("ru-RU").format(total) + " ₽"} />
      </FormSection>

      <div className="flex gap-2.5 flex-wrap mt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Сохраняем…" : "✓ Сохранить"}</Button>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>Отмена</Button>
      </div>
    </div>
  )
}
