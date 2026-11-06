"use client";

import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { SearchBox } from "./components/SearchBox";
import { WidgetCard } from "./components/WidgetCard";
import { WidgetSuggestions } from "./components/WidgetSuggestions";
import { db } from "./lib/firebase";

const fallbackWidget = {
  category: "Layout",
  level: "Beginner",
  name: "Container",
  arabicName: "الوعاء الأساسي في Flutter",
  description:
    "يستخدم Container لتحديد الحجم، الهامش، الحشو، اللون، والحدود داخل الواجهة، وهو من أكثر الودجت استخداماً في مشاريع Flutter.",
  code: `Container(
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.all(8),
  color: Colors.blue,
  child: Text('Hello Flutter'),
)`,
  icon: "C",
};

export default function Home() {
  const [widgets, setWidgets] = useState([fallbackWidget]);
  const [selectedName, setSelectedName] = useState(fallbackWidget.name);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWidgets = async () => {
      if (!db) {
        setWidgets([fallbackWidget]);
        setSelectedName(fallbackWidget.name);
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "widgets"));

        const items = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            category: "Firestore",
            level: "Custom",
            name: String(data.name || "Widget"),
            arabicName: "ودجت جديدة",
            description: "تمت إضافتها من النموذج إلى Firestore.",
            code: String(data.code || ""),
            icon: (String(data.name || "W").charAt(0) || "W").toUpperCase(),
          };
        });

        const nextWidgets = items.length ? items : [fallbackWidget];
        setWidgets(nextWidgets);
        setSelectedName((current) => current || nextWidgets[0].name);
      } catch (error) {
        console.error("Failed to load widgets:", error);
        setWidgets([fallbackWidget]);
        setSelectedName(fallbackWidget.name);
      } finally {
        setLoading(false);
      }
    };

    loadWidgets();
  }, []);

  const filteredWidgets = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    if (!normalizedQuery) {
      return widgets;
    }

    return widgets.filter((widget) =>
      widget.name.toLowerCase().includes(normalizedQuery)
    );
  }, [widgets, search]);

  const suggestionNames = filteredWidgets.map((widget) => widget.name);
  const selectedWidget =
    filteredWidgets.find((widget) => widget.name === selectedName) ||
    filteredWidgets[0] ||
    widgets[0] ||
    fallbackWidget;

  return (
    <main className="min-h-screen bg-[#0b1020] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-300">
            Flutter
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">Widgets Guide</h1>
        </header>

        <div className="mb-6 flex justify-center">
          <Link
            href="/addwidgetpage"
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            إضافة ويدجت جديدة
          </Link>
        </div>

        <SearchBox value={search} onChange={setSearch} />
        <WidgetSuggestions
          items={suggestionNames}
          selectedName={selectedName}
          onSelect={(name) => {
            setSelectedName(name);
          }}
        />

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-center text-slate-300">
            جاري تحميل الودجت...
          </div>
        ) : (
          <WidgetCard widget={selectedWidget} />
        )}
      </div>
    </main>
  );
}
