"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Loader from "@/components/ui/Loader"; // Assuming you have this from previous steps

// Premium Icon Set
const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  FileText: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
};

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
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
         {/* Use your premium loader here */}
         <div className="w-10 h-10 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
         <p className="mt-4 text-[#0B1C39] font-medium tracking-wide">Accessing Archives...</p>
      </div>
    );
  }

  return (
  <div className="w-dvw  mx-auto pr-10 md:p-8 space-y-8 min-h-screen overflow-x-hidden">
    
      {/* --- STICKY HEADER & CONTROLS --- */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md py-4 border-b border-[#D4A017]/10 px-4 md:px-8 shadow-sm">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-serif text-[#0B1C39] shrink-0">
              Legal Drafts
            </h1>
            <span className="bg-[#D4A017]/10 text-[#D4A017] text-xs font-bold px-2 py-1 rounded-full border border-[#D4A017]/20">
              {filtered.length} DOCS
            </span>
          </div>

          {/* Controls: Search & Create Button */}
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
                placeholder="Search documents..."
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

            {/* New Draft Button - Primary Action */}
            <Link 
              href="/dashboard/drafts/create" 
              className="flex items-center justify-center gap-2 bg-[#0B1C39] text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-[#0B1C39]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group border border-[#0B1C39]"
            >
              <span className="text-[#D4A017] group-hover:rotate-90 transition-transform duration-300"><Icons.Plus /></span>
              <span>New Draft</span>
            </Link>

          </div>
        </div>
      </div>

      {/* --- CONTENT AREA (List of Cards) --- */}
      <div className="space-y-4">
        
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
             <div className="w-16 h-16 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <Icons.FileText />
             </div>
             <p className="text-[#0B1C39] font-medium text-lg">No documents found</p>
             <p className="text-gray-400 text-sm mt-1">Try adjusting your search or create a new draft.</p>
          </div>
        ) : (
          filtered.map((d) => (
            <div
              key={d._id}
              className="group relative w- bg-white rounded-xl p-5 md:p-6 border border-[#D4A017]/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#D4A017] hover:-translate-y-1 flex flex-col md:flex-row gap-6 md:items-center"
            >
              {/* Icon & Type Info */}
              <div className="flex items-start gap-4 md:w-1/4 flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-[#FDF8E8] text-[#D4A017] border border-[#D4A017]/20 flex items-center justify-center shrink-0">
                  <Icons.FileText />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#0B1C39] text-lg leading-tight">
                    {d.draftType || "Legal Draft"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                    {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                  </p>
                </div>
              </div>

              {/* Middle Content: Excerpt & Case */}
              <div className="flex-1 space-y-3 ">
                 {/* Case Tag */}
                 <div className="flex items-center gap-2 text-xs font-medium text-[#0B1C39]/70">
                    <span className="text-[#D4A017]"><Icons.Briefcase /></span>
                    <span className="bg-[#F8F8F8] px-2 py-0.5 rounded border border-gray-200">
                      {d.caseId?.caseNumber?.toUpperCase() || "UNASSIGNED"}
                    </span>
                 </div>

                 {/* Excerpt */}
                 <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-serif italic">
                   "{d.content || "No content available..."}"
                 </p>
              </div>

              {/* Actions Area */}
              <div className="flex items-center gap-3 md:justify-end md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                
                {/* View Button */}
                <Link 
                  href={`/dashboard/drafts/${d._id}`} 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#0B1C39] bg-white border border-gray-200 hover:border-[#D4A017] hover:bg-[#D4A017]/10 transition-colors group/btn"
                  title="View Editor"
                >
                  <span className="group-hover/btn:scale-110 transition-transform"><Icons.Eye /></span>
                  <span>Open</span>
                </Link>

                {/* PDF Button */}
                {/* <a 
                  href={`${process.env.NEXT_PUBLIC_API}/drafts/${d._id}/pdf`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#D4A017] bg-[#0B1C39] border border-[#0B1C39] hover:bg-[#0B1C39]/90 transition-colors shadow-md"
                  title="Download PDF"
                >
                   <Icons.Download />
                   <span className="md:hidden">PDF</span>
                </a> */}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}