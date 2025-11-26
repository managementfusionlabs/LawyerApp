"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const f = searchParams?.get("filter");
    if (f) setFilter(f);
  }, [searchParams]);

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases`, { credentials: "include" });
        const data = await res.json();
        setCases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load cases", err);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  function btnClass(active) {
    if (active)
      return "px-3 py-1.5 rounded-xl text-sm font-medium bg-[#0B1C39] text-white border-2 border-[#D4A017] hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg";
    return "px-3 py-1.5 rounded-xl text-sm font-medium bg-white text-[#0B1C39] border border-gray-200 hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg";
  }


  const activeCount = cases.filter((c) => !(c.status || "").toLowerCase().includes("solved")).length;
  const solvedCount = cases.filter((c) => (c.status || "").toLowerCase().includes("solved")).length;

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const searched = cases.filter((c) => {
    const q = debounced;
    if (!q) return true;
    const caseNo = (c.caseNo || c.caseNumber || "").toString().toLowerCase();
    const client = (c.clientName || "").toString().toLowerCase();
    const id = (c._id || "").toString().toLowerCase();
    return caseNo.includes(q) || client.includes(q) || id.includes(q);
  });

  const visibleCases = searched.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return !(c.status || "").toLowerCase().includes("solved");
    if (filter === "solved") return (c.status || "").toLowerCase().includes("solved");
    return true;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="sticky top-14 md:top-0 z-30 bg-[#F9FAFB] pt-2 pb-4 -mx-4 md:-mx-6 px-4 md:px-6" style={{ WebkitBackdropFilter: "blur(4px)" }}>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold font-serif mb-0 text-[#0B1C39]">Cases</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("active")}
              aria-pressed={filter === "active"}
              className={`${btnClass(filter === "active")} relative`}
            >
              <span className="select-none">Active Cases</span>

              {activeCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold text-[#0B1C39] shadow">
                  <span className="w-2 h-2 bg-green-400 rounded-full blink-onoff" aria-hidden />
                  <span>{activeCount}</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setFilter("solved")}
              aria-pressed={filter === "solved"}
              className={`${btnClass(filter === "solved")} relative px-4 py-2 text-base`}
            >
              <span className="select-none">Solved</span>

              {solvedCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center gap-2 bg-white border border-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold text-[#0B1C39] shadow">
                  <span className="inline-flex items-center justify-center w-4 h-4">
                    <span className="inline-block w-2 h-2 bg-[#D4A017] rounded-full" aria-hidden />
                  </span>
                  <span>{solvedCount}</span>
                </span>
              )}
            </button>
          </div>

          <div className="ml-2 w-full max-w-sm">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0B1C39]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7 7 0 1010.65 10.65a7 7 0 005.999 5.999z"></path></svg>
              </span>

              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by case no, name or id"
                aria-label="Search cases by number, name or id"
                className="pl-10 pr-10 py-2 w-full rounded-xl border border-[#D4A017] bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4A017] shadow-md"
              />

              {search && (
                <button
                  aria-label="Clear search"
                  onClick={() => {
                    setSearch("");
                    setDebounced("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A017] text-[#0B1C39] hover:opacity-90 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" aria-hidden />

      {loading ? (
        <div>Loading cases...</div>
      ) : cases.length === 0 ? (
        <p className="text-gray-500">No cases found.</p>
      ) : (
        <div className="space-y-4">
          {visibleCases.map((c, index) => (
            <Link key={c._id} href={`/dashboard/cases/${c._id}`} className="block bg-white rounded-xl shadow-lg border-l-4 border-[#D4A017] p-4 md:hover:shadow-2xl transform md:hover:-translate-y-1 transition">
              <div className="flex justify-between items-center">
                <p>
                  <span className="font-semibold text-[#0B1C39]">S NO. :</span> {index + 1}
                </p>
                <h2 className="text-lg font-bold text-[#0B1C39]">{c.caseNo}</h2>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded text-[#0B1C39]">{c.status?.toUpperCase()}</span>
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
