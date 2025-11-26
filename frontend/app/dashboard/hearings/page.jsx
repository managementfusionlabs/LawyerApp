"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function UpcomingHearingsPage() {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/hearings/upcoming`, { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        const raw = Array.isArray(data.hearings) ? data.hearings : data.hearings || [];

        // Enrich hearings with case details if caseId is not populated
        const enriched = await Promise.all(
          raw.map(async (h) => {
            if (h.caseId && typeof h.caseId === "object" && (h.caseId.caseNumber || h.caseId.clientName)) {
              return h; // already populated
            }
            if (h.caseId) {
              try {
                const cr = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${h.caseId}`, { credentials: "include" });
                if (cr.ok) {
                  const cj = await cr.json();
                  return { ...h, caseId: cj.case || cj };
                }
              } catch (err) {
                console.error("Failed to fetch case for hearing", h.caseId, err);
              }
            }
            return h;
          })
        );

        setHearings(enriched);
      } catch (err) {
        console.error("Failed to load upcoming hearings", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = hearings.filter((h) => {
    const q = debounced;
    if (!q) return true;
    const caseNum = (h.caseId && (h.caseId.caseNumber || (typeof h.caseId === "string" ? h.caseId : ""))) || "";
    const client = (h.caseId && h.caseId.clientName) || "";
    return (
      caseNum.toString().toLowerCase().includes(q) ||
      client.toString().toLowerCase().includes(q) ||
      (h._id || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="sticky top-14 md:top-0 z-30 bg-[#F9FAFB] pt-2 pb-4 -mx-4 md:-mx-6 px-4 md:px-6" style={{ WebkitBackdropFilter: "blur(4px)" }}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold font-serif mb-0 text-[#0B1C39]">Upcoming Hearings</h1>

          <div className="ml-auto w-full max-w-sm">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0B1C39]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7 7 0 1010.65 10.65a7 7 0 005.999 5.999z"></path></svg>
              </span>

              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by case no"
                aria-label="Search hearings by case number or client"
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
        <div className="p-4">Loading upcoming hearings...</div>
      ) : hearings.length === 0 ? (
        <div className="p-4 text-gray-600">No upcoming hearings.</div>
      ) : filtered.length === 0 ? (
        <div className="p-4 text-gray-600">No hearings match your search.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => (
            <div key={h._id} className="bg-white rounded-xl shadow p-4 border-l-4 border-[#D4A017]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-[#0B1C39]">{h.date ? new Date(h.date).toLocaleString() : "—"}</p>
                </div>

                <div className="flex-1 px-4">
                  <p className="text-sm text-gray-600">Case</p>
                  <p className="font-semibold text-[#0B1C39]">{h.caseId?.caseNumber || h.caseId || "—"}</p>
                  {h.caseId?.clientName && <p className="text-sm text-gray-700">{h.caseId.clientName}</p>}
                </div>

                  <div className="text-right">
                  <p className="text-sm text-gray-600">Court</p>
                  <p className="font-medium text-[#0B1C39]">{h.court || "—"}</p>
                  <div className="mt-2">
                    <Link
                      href={`/dashboard/hearings/${h._id}`}
                      className="inline-block px-3 py-1.5 rounded-xl text-sm font-medium bg-[#0B1C39] text-white border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] shadow-sm"
                    >
                      View Hearing
                    </Link>
                  </div>
                </div>
              </div>
              {h.notes && <p className="mt-3 text-sm text-gray-700">Notes: {h.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
