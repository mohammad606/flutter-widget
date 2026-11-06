"use client";

import Link from "next/link";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

const defaultCode = ``;

export default function AddWidgetPage() {
  const [widgetName, setWidgetName] = useState("");
  const [code, setCode] = useState(defaultCode);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [widgets, setWidgets] = useState<Array<{ id: string; name: string }>>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const loadWidgets = async () => {
    if (!db) return;

    try {
      const snapshot = await getDocs(collection(db, "widgets"));
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: String(docSnap.data().name || "Widget"),
      }));

      setWidgets(items);
    } catch (loadError) {
      console.error("Failed to load widgets:", loadError);
    }
  };

  useEffect(() => {
    loadWidgets();

    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!auth) {
      setLoginError("Firebase Auth غير مهيأ. تأكد من إعداد .env.local.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setLoginError("");
      setLoginEmail("");
      setLoginPassword("");
      setMessage("تم تسجيل الدخول بنجاح. يمكنك الآن التعديل والحذف.");
      setError("");
    } catch (loginFailure) {
      console.error("Firebase auth login error:", loginFailure);
      setLoginError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }
  };

  const handleLogout = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
      setMessage("تم تسجيل الخروج بنجاح.");
      setError("");
    } catch (logoutError) {
      console.error("Sign out error:", logoutError);
      setError("حدثت مشكلة أثناء تسجيل الخروج.");
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!user) {
      setDeleteError("يجب تسجيل الدخول أولاً قبل الحذف.");
      return;
    }

    if (!db) {
      setDeleteError("Firebase غير مهيأ بعد.");
      return;
    }

    try {
      await deleteDoc(doc(db, "widgets", widgetId));
      setWidgets((current) => current.filter((widget) => widget.id !== widgetId));
      setDeleteTargetId(null);
      setDeleteError("");
      setMessage("تم حذف الودجت بنجاح.");
      setError("");
    } catch (deleteErrorInfo) {
      console.error("Delete widget error:", deleteErrorInfo);
      setDeleteError("حدثت مشكلة أثناء حذف الودجت.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("يجب تسجيل الدخول أولاً قبل إضافة الودجت.");
      setMessage("");
      return;
    }

    if (!widgetName.trim()) {
      setError("يرجى إدخال اسم الودجت.");
      setMessage("");
      return;
    }

    if (!code.trim()) {
      setError("يرجى كتابة كود الودجت.");
      setMessage("");
      return;
    }

    if (!db) {
      setError(
        "لم يتم تهيئة Firebase بعد. أضف متغيرات NEXT_PUBLIC_FIREBASE_* في ملف .env.local."
      );
      setMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");

      await addDoc(collection(db, "widgets"), {
        name: widgetName.trim(),
        code: code.trim(),
        createdAt: serverTimestamp(),
      });

      setMessage("تمت إضافة الودجت بنجاح إلى Firestore.");
      setWidgetName("");
      setCode(defaultCode);
      await loadWidgets();
    } catch (submitError) {
      console.error("Firestore save error:", submitError);
      setError("حدثت مشكلة أثناء حفظ البيانات في Firestore. تأكد من تهيئة المشروع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1020] px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            العودة للرئيسية
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
            >
              تسجيل الخروج
            </button>
          ) : null}
        </div>

        <div className="mb-8 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-cyan-300">
            Flutter
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">إضافة ويدجت جديدة</h1>
        </div>

        {!user ? (
          <section className="mb-8 rounded-2xl border border-cyan-500/30 bg-slate-950/70 p-5">
            <h2 className="mb-4 text-xl font-bold text-cyan-300">تسجيل الدخول للإدارة</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">كلمة المرور</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
        ) : (
          <>
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
                    <div key={widget.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-100">{widget.name}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTargetId(widget.id);
                            setDeleteError("");
                          }}
                          className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                        >
                          حذف
                        </button>
                      </div>

                      {deleteTargetId === widget.id ? (
                        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950 p-3">
                          <p className="mb-3 text-xs text-slate-300">
                            سيتم حذف الودجت بعد تأكيدك.
                          </p>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => handleDeleteWidget(widget.id)}
                              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400"
                            >
                              تأكيد الحذف
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTargetId(null);
                                setDeleteError("");
                              }}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm text-slate-300">اسم الودجت</label>
                <input
                  type="text"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  placeholder="مثل: Text"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">الكود الخاص بالودجت</label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
          </>
        )}
      </div>
    </main>
  );
}
