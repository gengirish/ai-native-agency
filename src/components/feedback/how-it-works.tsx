import { CheckCircle2, MessageCircleQuote, Wand2 } from "lucide-react"

const steps = [
  {
    icon: MessageCircleQuote,
    title: "Client says…",
    body: "Paste the vague note—\u201cmake it pop,\u201d \u201cmore premium,\u201d whatever landed in your inbox.",
  },
  {
    icon: Wand2,
    title: "AI translates…",
    body: "The copilot maps language to concrete parameters: spacing, type, color, layout, and copy tone with confidence scores.",
  },
  {
    icon: CheckCircle2,
    title: "You apply…",
    body: "Use the prioritized checklist in your file. Tick items off as you ship so nothing from the brief gets lost.",
  },
] as const

export function HowItWorks() {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
      <p className="mt-1 text-sm text-slate-600">Three steps from messy feedback to a buildable spec.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="relative flex flex-col items-center text-center">
            {i < steps.length - 1 && (
              <div
                className="absolute left-[calc(50%+2.5rem)] top-10 hidden h-px w-[calc(100%-5rem)] bg-gradient-to-r from-indigo-200 to-transparent md:block"
                aria-hidden
              />
            )}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              <step.icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
