import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const tiers = [
  {
    id: "starter" as const,
    name: "Starter",
    priceRange: "$999 – $2,499",
    period: "/mo",
    features: [
      "Up to 5 active projects",
      "48h first-draft SLA",
      "Email support",
      "1 revision per deliverable",
      "Standard AI models",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    id: "professional" as const,
    name: "Professional",
    priceRange: "$2,500 – $7,999",
    period: "/mo",
    features: [
      "Unlimited projects (fair use)",
      "24h first-draft SLA",
      "Priority chat & email",
      "3 revisions per deliverable",
      "Premium models + brand DNA",
      "1 guaranteed credit / month",
    ],
    cta: "Start free trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    priceRange: "Custom",
    period: "",
    features: [
      "Dedicated success manager",
      "4h first-draft SLA",
      "Unlimited revisions",
      "Custom integrations & SSO",
      "3 guaranteed credits / month",
      "Volume pricing & MSAs",
    ],
    cta: "Contact Sales",
    highlight: false,
    enterprise: true,
  },
]

const comparisonRows = [
  { label: "First draft turnaround", starter: "48h", professional: "24h", enterprise: "4h" },
  { label: "Final delivery SLA", starter: "120h", professional: "72h", enterprise: "24h" },
  { label: "Revisions per deliverable", starter: "1", professional: "3", enterprise: "Unlimited" },
  { label: "Guaranteed credits", starter: "—", professional: "1 / mo", enterprise: "3 / mo" },
  { label: "Support", starter: "Email", professional: "Priority", enterprise: "Dedicated" },
]

export function PricingPlansPanel() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "relative flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
              tier.highlight &&
                "z-10 scale-[1.02] border-indigo-500 shadow-lg ring-2 ring-indigo-500 md:-my-1",
            )}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
                {tier.badge}
              </span>
            )}
            <h3 className="text-lg font-semibold text-slate-900">{tier.name}</h3>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">{tier.priceRange}</span>
              {tier.period ? (
                <span className="text-sm font-normal text-slate-500">{tier.period}</span>
              ) : null}
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-600">
              {tier.features.map((f) => (
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
                tier.enterprise
                  ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  : tier.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-900 text-white hover:bg-slate-800",
              )}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Feature comparison</h3>
          <p className="mt-0.5 text-sm text-slate-500">How plans differ at a glance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
                <th className="px-6 py-3 font-medium text-slate-700">Capability</th>
                <th className="px-4 py-3 font-medium text-slate-700">Starter</th>
                <th className="px-4 py-3 font-medium text-indigo-700">Professional</th>
                <th className="px-4 py-3 font-medium text-slate-700">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={cn("border-b border-slate-100", i % 2 === 1 && "bg-slate-50/50")}
                >
                  <td className="px-6 py-3 text-slate-700">{row.label}</td>
                  <td className="px-4 py-3 text-slate-600">{row.starter}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.professional}</td>
                  <td className="px-4 py-3 text-slate-600">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
