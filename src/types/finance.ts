export interface DynamicRow {
  id: string
  label: string
  amount: number
  comment: string
  extra?: string
}

export interface IncomeData {
  active: DynamicRow[]
  passive: DynamicRow[]
}

export interface ExpenseData extends DynamicRow {
  category: string
}

export interface BankAccount extends DynamicRow {
  accountType: string
}

export interface AssetRow extends DynamicRow {
  assetType: string
}

export interface MortgageData {
  params: DynamicRow[]
  loan: DynamicRow[]
  rent: DynamicRow[]
}

export interface FinanceState {
  income: IncomeData
  expenses: ExpenseData[]
  banks: BankAccount[]
  assets: AssetRow[]
  cushion: DynamicRow[]
  mortgage: MortgageData
}

export interface HistoryRecord {
  id: string
  created_at: string
  user_id: string
  active_income: number
  passive_income: number
  total_income: number
  total_expenses: number
  delta: number
  total_capital: number
  cushion_total: number
  snapshot: FinanceState
}

export const BANK_TYPES = [
  { v: "bank", l: "🏦 Банк / карта" },
  { v: "saving", l: "💰 Накопительный счёт" },
  { v: "deposit", l: "📈 Вклад" },
  { v: "broker", l: "📊 Брокерский счёт" },
  { v: "iis", l: "📑 ИИС" },
  { v: "crypto", l: "₿ Крипто" },
  { v: "cash_rub", l: "💵 Наличные ₽" },
  { v: "cash_usd", l: "💵 Наличные $" },
  { v: "cash_eur", l: "💶 Наличные €" },
  { v: "other", l: "◎ Другое" },
]

export const ASSET_TYPES = [
  { v: "usd", l: "Нал. USD" },
  { v: "eur", l: "Нал. EUR" },
  { v: "stocks", l: "Акции/Фонды" },
  { v: "iis", l: "ИИС" },
  { v: "deposit", l: "Вклад" },
  { v: "saving", l: "Нак. счёт" },
  { v: "realty", l: "Недвижимость" },
  { v: "crypto", l: "Крипто" },
  { v: "other", l: "Прочее" },
]

export const EXPENSE_CATEGORIES = [
  "Жильё/ипотека","Еда","Транспорт","Инвестиции",
  "Подписки","Здоровье","Развлечения","Семья/дети","Одежда/бьюти","Прочее",
]

export const EXPENSE_COLORS = [
  "#2a5c3f","#4a8c62","#8fc4a4","#2e4fa3","#6a8fd4",
  "#9a7c10","#c4a030","#b05c20","#d4884a","#a09d93",
]

export const BANK_ICONS: Record<string, string> = {
  bank:"🏦", saving:"💰", deposit:"📈", broker:"📊",
  iis:"📑", crypto:"₿", cash_rub:"💵", cash_usd:"💵", cash_eur:"💶", other:"◎",
}

export function formatRub(n: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n) + " ₽"
}

export function genId(): string {
  return Math.random().toString(36).slice(2, 9)
}
