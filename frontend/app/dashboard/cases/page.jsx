"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Custom Premium Icon Set
const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  ArrowRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
};

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

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Filter Logic
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

  // Counts for the tabs
  const activeCount = cases.filter((c) => !(c.status || "").toLowerCase().includes("solved")).length;
  const solvedCount = cases.filter((c) => (c.status || "").toLowerCase().includes("solved")).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* --- STICKY HEADER & CONTROLS --- */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md py-4 border-b border-[#D4A017]/10 -mx-4 md:-mx-8 px-4 md:px-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title */}
          <h1 className="text-3xl font-bold font-serif text-[#0B1C39] shrink-0">
            Case Registry
          </h1>

          {/* Controls Row: Search + Tabs */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            
            {/* Search Input */}
            <div className="relative group w-full md:w-80">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4A017] transition-colors">
                <Icons.Search />
              </span>
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case no, client..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#0B1C39] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setDebounced(""); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0B1C39]"
                >
                  <Icons.Close />
                </button>
              )}
            </div>

            {/* Premium Tab Toggle */}
            <div className="bg-gray-200/50 p-1 rounded-xl flex items-center shrink-0">
              {[
                { id: "all", label: "All Cases", count: cases.length },
                { id: "active", label: "Active", count: activeCount },
                { id: "solved", label: "Solved", count: solvedCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                    ${filter === tab.id 
                      ? "bg-[#0B1C39] text-[#D4A017] shadow-lg scale-100" 
                      : "text-gray-500 hover:bg-gray-200 hover:text-[#0B1C39]"}
                  `}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 rounded-full ${filter === tab.id ? "bg-[#D4A017] text-[#0B1C39]" : "bg-gray-300 text-gray-600"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
           <div className="w-8 h-8 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
           <p className="mt-4 text-[#0B1C39] font-medium">Retrieving Files...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-lg">No cases found in the registry.</p>
        </div>
      ) : visibleCases.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">No results match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visibleCases.map((c) => (
            <Link 
              key={c._id} 
              href={`/dashboard/cases/${c._id}`} 
              className="group relative block bg-white rounded-xl p-5 md:p-6 border border-[#D4A017]/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#D4A017] hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left Side: Case Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#F8F8F8] p-2 rounded-lg text-[#D4A017]">
                      <Icons.Briefcase />
                    </span>
                    <h2 className="text-xl font-bold font-serif text-[#0B1C39] tracking-wide">
                      {c.caseNo}
                    </h2>
                    
                    {/* Status Badge */}
                    <span className={`
                      text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
                      ${(c.status || "").toLowerCase().includes("solved") 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-[#0B1C39]/5 text-[#0B1C39] border border-[#0B1C39]/10"}
                    `}>
                      {c.status || "Active"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-8 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-[#0B1C39] transition-colors">
                      <span className="text-[#D4A017]/70"><Icons.User /></span>
                      <span className="font-medium">{c.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-[#D4A017]/70"><Icons.Calendar /></span>
                      <span>Filed: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Arrow Action */}
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#F8F8F8] text-[#D4A017] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <Icons.ArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}