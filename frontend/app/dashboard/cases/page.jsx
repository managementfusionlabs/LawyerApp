"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/cases`,
          { credentials: "include" }
        );

        const data = await res.json();
        setCases(data);
      } catch (err) {
        console.log("Failed to load cases", err);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold font-serif mb-6 text-[#0B1C39]">Cases</h1>

      {loading ? (
        <div>Loading cases...</div>
      ) : cases.length === 0 ? (
        <p className="text-gray-500">No cases found.</p>
      ) : (
        <div className="space-y-4">
          {cases.map((c, index) => (
            <Link
              key={c._id}
              href={`/dashboard/cases/${c._id}`}
              className="block bg-white rounded-xl shadow-lg border-l-4 border-[#D4A017] p-4 md:hover:shadow-2xl transform md:hover:-translate-y-1 transition"
            >
              <div className="flex justify-between items-center">
                <p>
                  <span className="font-semibold text-[#0B1C39]">S NO. :</span> {index + 1}
                </p>
                <h2 className="text-lg font-bold text-[#0B1C39]">{c.caseNo}</h2>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded text-[#0B1C39]">
                  {c.status?.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 font-medium mt-1 text-[#0B1C39]">{c.clientName}</p>

              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
