"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Loader from "@/components/ui/Loader";

export default function DraftListPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts`, {
          credentials: "include",
        });
        const data = await res.json();
        setDrafts(data.drafts || []);
      } catch (err) {
        console.error("LOAD DRAFTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = drafts.filter((d) => {
    const q = debounced;
    if (!q) return true;
    const type = (d.draftType || "").toLowerCase();
    const content = (d.content || "").toLowerCase();
    const caseNo = (d.caseId && (d.caseId.caseNumber || "") || "").toString().toLowerCase();
    return type.includes(q) || content.includes(q) || caseNo.includes(q);
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader text="Loading drafts..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="sticky top-14 md:top-0 z-30 bg-[#F9FAFB] pt-2 pb-4 -mx-4 md:-mx-6 px-4 md:px-6" style={{ WebkitBackdropFilter: "blur(4px)" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <h1 className="text-xl md:text-2xl font-bold font-serif text-[#0B1C39]">Drafts</h1>
          <Link href="/dashboard/drafts/create" className="bg-[#0B1C39] text-white px-4 py-2 rounded-md text-sm border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]">
            + New Draft
          </Link>

          <div className="w-full md:w-80">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0B1C39]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7 7 0 1010.65 10.65a7 7 0 005.999 5.999z"></path></svg>
              </span>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search by type, text or case no"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search drafts by type, text or case number"
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

      {/* spacer so first draft card isn't hidden under the sticky header */}
      <div className="h-16" aria-hidden="true" />

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {filtered.length === 0 ? (
          <div className="text-gray-600 p-4 bg-white rounded shadow">No drafts found.</div>
        ) : (
          filtered.map((d) => (
            <Link
              key={d._id}
              href={`/dashboard/drafts/${d._id}`}
              className="block bg-white rounded-xl shadow-lg border-l-4 border-[#D4A017] p-4 md:hover:shadow-2xl transform md:hover:-translate-y-1 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-[#0B1C39]">{d.draftType || "Draft"}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(d.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right text-xs text-[#0B1C39] font-medium">Case: {d.caseId?.caseNumber?.toUpperCase() || "—"}</div>

              </div>

              <p className="text-sm text-gray-700 line-clamp-3">{d.content || "No content"}</p>
            </Link>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F4F6F8] text-left text-sm">
            <tr className="text-[#0B1C39]">
              <th className="p-3">Type</th>
              <th className="p-3">Case</th>
              <th className="p-3">Excerpt</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-600">No drafts found.</td>
              </tr>
            )}

            {filtered.map((d) => (
              <tr key={d._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium text-[#0B1C39]">{ "GENERATED"}</td>
                <td className="p-3">{d.caseId?.caseNumber.toUpperCase() || "—"}</td>

                <td className="p-3 text-sm line-clamp-2">{d.content ? d.content.slice(0, 120) + (d.content.length>120?"...":"") : "—"}</td>
                <td className="p-3 text-sm text-gray-600">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/drafts/${d._id}`} className="text-[#0B1C39] font-medium transition-all duration-200 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] px-3 py-1">View</Link>
                    <a href={`${process.env.NEXT_PUBLIC_API}/drafts/${d._id}/pdf`} className="text-[#0B1C39] transition-all duration-200 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] px-3 py-1">PDF</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-6 text-xs text-gray-500">
        Uploaded file reference: <code className="break-all">{"/mnt/data/2025-11-21T19-38-12.471Z.png"}</code>
      </div> */}
    </div>
  );
}
