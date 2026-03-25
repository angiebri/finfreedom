"use client"
import { Trash2 } from "lucide-react"
import clsx from "clsx"

interface SelectOption { v: string; l: string }

interface Props {
  label: string
  amount: number
  comment: string
  extra?: string
  extraLabel?: string
  extraOptions?: SelectOption[]
  onLabelChange: (v: string) => void
  onAmountChange: (v: number) => void
  onCommentChange: (v: string) => void
  onExtraChange?: (v: string) => void
  onRemove: () => void
  className?: string
}

export default function DynamicRow({
  label, amount, comment, extra, extraLabel, extraOptions,
  onLabelChange, onAmountChange, onCommentChange, onExtraChange, onRemove, className,
}: Props) {
  return (
    <div className={clsx("bg-surface border border-border rounded-[7px] p-3", className)}>
      {/* Top row */}
      <div className="flex flex-wrap gap-2 items-end mb-2">
        {/* Label */}
        <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
          <label className="text-[11px] font-semibold text-ink2">Название поля</label>
          <input
            type="text"
            value={label}
            onChange={e => onLabelChange(e.target.value)}
            placeholder="Напр. Зарплата"
            className="w-full px-2.5 py-2 border border-border2 rounded-[7px] text-[13px] bg-surface text-ink transition-colors"
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1 min-w-[110px]">
          <label className="text-[11px] font-semibold text-ink2">Сумма, ₽</label>
          <input
            type="number"
            value={amount || ""}
            onChange={e => onAmountChange(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-2.5 py-2 border border-border2 rounded-[7px] text-[13px] bg-surface text-ink transition-colors"
          />
        </div>

        {/* Extra select */}
        {extraOptions && onExtraChange && (
          <div className="flex flex-col gap-1 min-w-[130px]">
            <label className="text-[11px] font-semibold text-ink2">{extraLabel || "Тип"}</label>
            <select
              value={extra || ""}
              onChange={e => onExtraChange(e.target.value)}
              className="w-full px-2.5 py-2 border border-border2 rounded-[7px] text-[13px] bg-surface text-ink transition-colors"
            >
              {extraOptions.map(o => (
                <option key={o.v} value={o.v}>{o.l}</option>
              ))}
            </select>
          </div>
        )}

        {/* Remove */}
        <button
          onClick={onRemove}
          className="self-end flex items-center justify-center w-8 h-8 bg-red-light text-red rounded-[6px] hover:bg-red hover:text-white transition-colors flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-ink2">Комментарий / детали</label>
        <textarea
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          placeholder="Любые заметки, условия, детали…"
          rows={2}
          className="w-full px-2.5 py-2 border border-border2 rounded-[7px] text-[12px] bg-surface text-ink transition-colors resize-none"
        />
      </div>
    </div>
  )
}
