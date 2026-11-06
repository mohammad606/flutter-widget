import type { WidgetItem } from "../types";

type WidgetListProps = {
  widgets: WidgetItem[];
  deleteTargetId: string | null;
  deleteError: string;
  onDeleteRequest: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
};

export function WidgetList({
  widgets,
  deleteTargetId,
  deleteError,
  onDeleteRequest,
  onConfirmDelete,
  onCancelDelete,
}: WidgetListProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">كل الودجت الحالية</h2>
        <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-300">
          {widgets.length} عنصر
        </span>
      </div>

      {widgets.length === 0 ? (
        <p className="text-sm text-slate-400">لا توجد ويدجت مضافة حتى الآن.</p>
      ) : (
        <div className="space-y-3">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-100">{widget.name}</p>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(widget.id)}
                  className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                >
                  حذف
                </button>
              </div>

              {deleteTargetId === widget.id ? (
                <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950 p-3">
                  <p className="mb-3 text-xs text-slate-300">سيتم حذف الودجت بعد تأكيدك.</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => onConfirmDelete(widget.id)}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400"
                    >
                      تأكيد الحذف
                    </button>
                    <button
                      type="button"
                      onClick={onCancelDelete}
                      className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-300"
                    >
                      إلغاء
                    </button>
                  </div>

                  {deleteError ? (
                    <p className="mt-2 text-xs text-red-300">{deleteError}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
