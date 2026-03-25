"use client"
import { useState } from "react"
import type { FinanceState, AssetRow, DynamicRow } from "@/types/finance"
import { genId, ASSET_TYPES } from "@/types/finance"
import DynamicRowComp from "@/components/forms/DynamicRow"
import { FormSection, PageHeader, Button } from "@/components/ui"
import { useToast } from "@/components/ui"

interface Props {
  state: FinanceState
  onSave: (s: FinanceState) => Promise<void>
  saving: boolean
  onNavigate: (p: string) => void
}

export default function AssetsPage({ state, onSave, saving, onNavigate }: Props) {
  const toast = useToast()
  const [assets, setAssets] = useState<AssetRow[]>(() => state.assets.map(r => ({ ...r })))
  const [cushion, setCushion] = useState<DynamicRow[]>(() => state.cushion.map(r => ({ ...r })))

  function updateAsset(id: string, field: keyof AssetRow, value: unknown) {
    setAssets(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }
  function updateCushion(id: string, field: keyof DynamicRow, value: unknown) {
    setCushion(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  async function handleSave() {
    await onSave({ ...state, assets, cushion })
    toast("✓ Активы сохранены")
    onNavigate("dashboard")
  }

  const totalAssets = assets.reduce((s, r) => s + r.amount, 0)
  const totalCushion = cushion.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="animate-fade-in">
      <PageHeader title="Активы" subtitle="Стоимость финансовых активов и подушка безопасности" />

      <FormSection
        title="◆ Финансовые активы"
        onAdd={() => setAssets(prev => [...prev, { id: genId(), label: "", amount: 0, comment: "", extra: "", assetType: "other" }])}
        addLabel="Добавить актив"
      >
        {assets.map(row => (
          <DynamicRowComp
            key={row.id}
            label={row.label} amount={row.amount} comment={row.comment} extra={row.assetType}
            extraLabel="Тип" extraOptions={ASSET_TYPES}
            onLabelChange={v => updateAsset(row.id, "label", v)}
            onAmountChange={v => updateAsset(row.id, "amount", v)}
            onCommentChange={v => updateAsset(row.id, "comment", v)}
            onExtraChange={v => updateAsset(row.id, "assetType", v)}
            onRemove={() => setAssets(prev => prev.filter(r => r.id !== row.id))}
          />
        ))}
        <div className="flex justify-between pt-3 mt-1 border-t-2 border-border font-bold text-[13px]">
          <span>Итого активы</span>
          <span>{new Intl.NumberFormat("ru-RU").format(totalAssets)} ₽</span>
        </div>
      </FormSection>

      <FormSection
        title="🛡 Подушка безопасности"
        onAdd={() => setCushion(prev => [...prev, { id: genId(), label: "", amount: 0, comment: "" }])}
        addLabel="Добавить источник"
      >
        {cushion.map(row => (
          <DynamicRowComp
            key={row.id}
            label={row.label} amount={row.amount} comment={row.comment}
            onLabelChange={v => updateCushion(row.id, "label", v)}
            onAmountChange={v => updateCushion(row.id, "amount", v)}
            onCommentChange={v => updateCushion(row.id, "comment", v)}
            onRemove={() => setCushion(prev => prev.filter(r => r.id !== row.id))}
          />
        ))}
        <div className="flex justify-between pt-3 mt-1 border-t-2 border-border font-bold text-[13px]">
          <span>Итого подушка</span>
          <span>{new Intl.NumberFormat("ru-RU").format(totalCushion)} ₽</span>
        </div>
      </FormSection>

      <div className="flex gap-2.5 flex-wrap mt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Сохраняем…" : "✓ Сохранить активы"}</Button>
        <Button variant="secondary" onClick={() => onNavigate("dashboard")}>Отмена</Button>
      </div>
    </div>
  )
}
