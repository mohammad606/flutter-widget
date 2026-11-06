import { WidgetDefinition } from "./WidgetDefinition";

type WidgetCardProps = {
  widget: {
    category: string;
    level: string;
    name: string;
    arabicName: string;
    description: string;
    code: string;
    icon: string;
  };
};

export function WidgetCard({ widget }: WidgetCardProps) {
  return (
    <section className="mt-8 rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl shadow-slate-950/30">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
          {widget.category}
        </span>
        <span className="text-sm text-slate-400">{widget.level}</span>
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-black text-slate-950">
          {widget.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{widget.name}</h2>
          <p className="text-sm text-slate-400">{widget.arabicName}</p>
        </div>
      </div>

      <WidgetDefinition description={widget.description} code={widget.code} />
    </section>
  );
}
