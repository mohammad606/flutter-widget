type WidgetSuggestionsProps = {
  items: string[];
  selectedName?: string;
  onSelect: (name: string) => void;
};

export function WidgetSuggestions({ items, selectedName, onSelect }: WidgetSuggestionsProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">لا توجد نتائج مطابقة للبحث.</p>
      ) : (
        items.map((item) => {
          const active = item === selectedName;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : "border-slate-700 bg-slate-800 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
              }`}
            >
              {item}
            </button>
          );
        })
      )}
    </div>
  );
}
