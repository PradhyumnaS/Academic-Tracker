"use client";

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// Firebase config (reuse your config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ADMIN_EMAILS = ["pradycod@gmail.com"]; // <-- Add your admin emails here

const AdminDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        router.push("/login");
      } else {
        const snapshot = await getDocs(collection(db, "contribution"));
        const docs = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      }
    });
  }, [router]);

  const exportCSV = () => {
    const rows = data.map(({ email, patents, publications, conferences, events }) => ({
      email, patents, publications, conferences, events
    }));
    const csv = [
      "email,patents,publications,conferences,events",
      ...rows.map(row =>
        [row.email, row.patents, row.publications, row.conferences, row.events]
          .map(field => `"${(field || "").replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contributions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-800 tracking-tight drop-shadow">
            Admin Dashboard
          </h1>
          <button
            onClick={exportCSV}
            className="bg-amber-700 hover:bg-amber-800 transition-colors text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
          >
            Export CSV
          </button>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-2xl border border-amber-100 overflow-x-auto p-6">
          <table className="min-w-[900px] w-full text-left">
            <thead>
              <tr className="bg-amber-700">
                <th className="px-4 py-3 text-sm font-bold text-white rounded-tl-2xl">Email</th>
                <th className="px-4 py-3 text-sm font-bold text-white">Patents</th>
                <th className="px-4 py-3 text-sm font-bold text-white">Publications</th>
                <th className="px-4 py-3 text-sm font-bold text-white">Conferences</th>
                <th className="px-4 py-3 text-sm font-bold text-white rounded-tr-2xl">Events</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-amber-400 text-lg font-semibold">
                    No contributions found.
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "bg-amber-50/80 hover:bg-amber-100 transition-colors"
                        : "bg-white hover:bg-amber-100 transition-colors"
                    }
                  >
                    <td className="border-b border-amber-100 px-4 py-4 text-amber-900 font-semibold align-top max-w-xs break-words">
                      {row.email}
                    </td>
                    <td className="border-b border-amber-100 px-4 py-4 text-amber-800 align-top max-w-xs break-words whitespace-pre-line">
                      {row.patents || <span className="text-amber-300 italic">—</span>}
                    </td>
                    <td className="border-b border-amber-100 px-4 py-4 text-amber-800 align-top max-w-xs break-words whitespace-pre-line">
                      {row.publications || <span className="text-amber-300 italic">—</span>}
                    </td>
                    <td className="border-b border-amber-100 px-4 py-4 text-amber-800 align-top max-w-xs break-words whitespace-pre-line">
                      {row.conferences || <span className="text-amber-300 italic">—</span>}
                    </td>
                    <td className="border-b border-amber-100 px-4 py-4 text-amber-800 align-top max-w-xs break-words whitespace-pre-line">
                      {row.events || <span className="text-amber-300 italic">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;