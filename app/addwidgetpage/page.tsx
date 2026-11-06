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
import { AddWidgetForm } from "./components/AddWidgetForm";
import { LoginForm } from "./components/LoginForm";
import { WidgetList } from "./components/WidgetList";
import { auth, db } from "../lib/firebase";
import type { WidgetItem } from "./types";

const defaultCode = ``;

export default function AddWidgetPage() {
  const [widgetName, setWidgetName] = useState("");
  const [code, setCode] = useState(defaultCode);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);
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
          <LoginForm
            loginEmail={loginEmail}
            loginPassword={loginPassword}
            loginError={loginError}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={handleLogin}
          />
        ) : (
          <>
            <WidgetList
              widgets={widgets}
              deleteTargetId={deleteTargetId}
              deleteError={deleteError}
              onDeleteRequest={(id) => {
                setDeleteTargetId(id);
                setDeleteError("");
              }}
              onConfirmDelete={handleDeleteWidget}
              onCancelDelete={() => {
                setDeleteTargetId(null);
                setDeleteError("");
              }}
            />

            <AddWidgetForm
              widgetName={widgetName}
              code={code}
              error={error}
              message={message}
              isSubmitting={isSubmitting}
              onNameChange={setWidgetName}
              onCodeChange={setCode}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </main>
  );
}
