type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/20">
      <label className="mb-3 block text-sm text-slate-300">ابحث عن ويدجت</label>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
        <span className="text-xl">⌕</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search for a widget..."
          className="w-full bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
