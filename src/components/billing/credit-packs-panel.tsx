import { Check } from "lucide-react"
import type { CreditPack } from "@/types"
import { cn, formatCurrency } from "@/lib/utils"

export function CreditPacksPanel({ packs }: { packs: CreditPack[] }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      {packs.map((pack) => (
        <div
          key={pack.id}
          className={cn(
            "flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
            pack.popular && "relative z-10 scale-[1.02] border-indigo-500 shadow-lg ring-2 ring-indigo-500 md:-my-1",
          )}
        >
          {pack.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
              Popular
            </span>
          )}
          <h3 className="text-lg font-semibold text-slate-900">{pack.name}</h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{pack.credits}</p>
          <p className="text-sm text-slate-500">credits</p>
          <p className="mt-4 text-2xl font-semibold text-slate-900">{formatCurrency(pack.price)}</p>
          <p className="text-sm text-slate-500">
            {formatCurrency(pack.pricePerCredit)} per credit
          </p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-600">
            {pack.features.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={cn(
              "mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition",
              pack.popular
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
            )}
          >
            Purchase
          </button>
        </div>
      ))}
    </div>
  )
}
