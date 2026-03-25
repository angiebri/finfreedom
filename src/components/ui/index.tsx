"use client"
import clsx from "clsx"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

/* ── Card ── */
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("bg-surface border border-border rounded-card shadow-card", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <span className="font-bold text-[13.5px] text-ink">{title}</span>
      {action}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("p-4", className)}>{children}</div>
}

/* ── Badge ── */
type BadgeVariant = "green" | "red" | "gold" | "blue" | "gray"
const badgeStyles: Record<BadgeVariant, string> = {
  green: "bg-green-light text-green",
  red: "bg-red-light text-red",
  gold: "bg-gold-light text-gold",
  blue: "bg-blue-light text-blue",
  gray: "bg-border text-ink2",
}
export function Badge({ children, variant = "gray" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold", badgeStyles[variant])}>
      {children}
    </span>
  )
}

/* ── Button ── */
type BtnVariant = "primary" | "secondary" | "danger" | "ghost"
const btnStyles: Record<BtnVariant, string> = {
  primary: "bg-green text-white hover:bg-green-700",
  secondary: "bg-surface text-ink border border-border2 hover:bg-bg",
  danger: "bg-red text-white hover:bg-red-700",
  ghost: "text-ink2 hover:text-ink hover:bg-border",
}
export function Button({
  children, onClick, variant = "primary", size = "md", disabled, type = "button", className,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: BtnVariant
  size?: "sm" | "md"
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center gap-1.5 font-semibold rounded-[7px] transition-colors disabled:opacity-60",
        size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-4 py-2 text-[13px]",
        btnStyles[variant],
        className
      )}
    >
      {children}
    </button>
  )
}

/* ── Progress Bar ── */
type BarColor = "green" | "gold" | "red" | "blue"
const barColors: Record<BarColor, string> = {
  green: "bg-green", gold: "bg-gold", red: "bg-red", blue: "bg-blue",
}
export function ProgressBar({ value, color = "green", height = 6 }: { value: number; color?: BarColor; height?: number }) {
  return (
    <div className="w-full bg-border rounded-full overflow-hidden" style={{ height }}>
      <div
        className={clsx("h-full rounded-full transition-all duration-500", barColors[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

/* ── Stat Card ── */
export function StatCard({
  label, value, meta, badge, badgeVariant,
}: {
  label: string
  value: string
  meta?: string
  badge?: string
  badgeVariant?: BadgeVariant
}) {
  return (
    <div className="bg-surface border border-border rounded-card shadow-card p-4">
      <div className="text-[10px] uppercase tracking-[0.7px] text-ink3 font-semibold">{label}</div>
      <div className="font-serif text-[22px] tracking-tight text-ink my-1.5">{value}</div>
      <div className="text-[11px] text-ink2 flex items-center gap-1.5 flex-wrap">
        {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        {meta && <span>{meta}</span>}
      </div>
    </div>
  )
}

/* ── Form Section ── */
export function FormSection({
  title, children, onAdd, addLabel,
}: {
  title: string
  children: React.ReactNode
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="bg-surface2 border border-border rounded-card p-4 mb-3">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="text-[13px] font-bold text-ink">{title}</span>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface border border-border2 rounded-[7px] text-[11px] font-semibold text-ink2 hover:border-green hover:text-green hover:bg-green-light transition-colors"
          >
            <Plus size={12} />
            {addLabel || "Добавить"}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

/* ── Add Row Button ── */
export function AddRowButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2.5 bg-surface border-[1.5px] border-dashed border-border2 rounded-[7px] text-[12px] font-semibold text-ink2 hover:border-green hover:text-green hover:bg-green-light transition-colors mt-2"
    >
      <Plus size={13} />
      {label || "Добавить поле"}
    </button>
  )
}

/* ── Total Row ── */
export function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-border font-bold text-[14px] text-ink">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

/* ── Empty State ── */
export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-8 px-4 text-ink3 text-[13px]">
      <div className="text-3xl mb-2">{icon}</div>
      {text}
    </div>
  )
}

/* ── Toast ── */
let toastFn: (msg: string) => void = () => {}
export function useToast() { return toastFn }

export function ToastProvider() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])
  useEffect(() => {
    toastFn = (msg) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, msg }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
    }
  }, [])
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="bg-ink text-white px-4 py-2.5 rounded-[7px] text-[13px] font-semibold shadow-lg toast-in max-w-[260px]">
          {t.msg}
        </div>
      ))}
    </div>
  )
}

/* ── Page Header ── */
export function PageHeader({
  title, subtitle, action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="font-serif text-[24px] lg:text-[26px] tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="text-[12px] text-ink2 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
