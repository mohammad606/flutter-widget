import type { FormEvent } from "react";

type AddWidgetFormProps = {
  widgetName: string;
  code: string;
  error: string;
  message: string;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function AddWidgetForm({
  widgetName,
  code,
  error,
  message,
  isSubmitting,
  onNameChange,
  onCodeChange,
  onSubmit,
}: AddWidgetFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-slate-300">اسم الودجت</label>
        <input
          type="text"
          value={widgetName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="مثل: Text"
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">الكود الخاص بالودجت</label>
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          rows={16}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-cyan-300 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-base font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "جاري الإرسال..." : "إضافة الودجت"}
      </button>
    </form>
  );
}
