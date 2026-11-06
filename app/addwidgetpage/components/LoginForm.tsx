import type { FormEvent } from "react";

type LoginFormProps = {
  loginEmail: string;
  loginPassword: string;
  loginError: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function LoginForm({
  loginEmail,
  loginPassword,
  loginError,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <section className="mb-8 rounded-2xl border border-cyan-500/30 bg-slate-950/70 p-5">
      <h2 className="mb-4 text-xl font-bold text-cyan-300">تسجيل الدخول للإدارة</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">البريد الإلكتروني</label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">كلمة المرور</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="أدخل كلمة المرور"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {loginError ? (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {loginError}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-base font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          تسجيل الدخول
        </button>
      </form>
    </section>
  );
}
