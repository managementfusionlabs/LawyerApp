"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// --- CUSTOM ICONS ---
const Icons = {
  Sparkles: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z"/></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  FileText: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
};

export default function AIDraftGenerator() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [casesLoading, setCasesLoading] = useState(true);
  const [caseList, setCaseList] = useState([]);
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    caseId: "",
    caseName: "", // For display purposes
    draftType: "",
    extraNotes: "",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch cases
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/my-cases`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCaseList(Array.isArray(data) ? data : []);
        } else {
          setCaseList([]);
        }
      } catch (err) {
        console.log(err);
        setCaseList([]);
      } finally {
        setCasesLoading(false);
      }
    })();
  }, []);

  // Filter cases for the dropdown
  const filteredCases = caseList.filter((c) =>
    (c.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.caseNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCase = (c) => {
    setForm({ ...form, caseId: c._id, caseName: `${c.clientName} (${c.caseNumber})` });
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const generateDraft = async (e) => {
    e.preventDefault();
    if (!form.caseId) {
      alert("Please select a case to continue.");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/drafts/case/${form.caseId}/generate`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draftType: form.draftType,
            extraNotes: form.extraNotes,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "AI failed to generate draft");
        return;
      }

      router.push(`/dashboard/drafts/${data.draft._id}?success=generated`);
    } catch (err) {
      console.log(err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex justify-center items-start pt-10">
      
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#D4A017]/20 overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="bg-[#F8F8F8] px-8 py-6 border-b border-[#D4A017]/20 flex items-center gap-4 relative overflow-hidden">
          {/* Decorative Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B1C39] via-[#D4A017] to-[#0B1C39]"></div>
          
          <div className="w-12 h-12 rounded-xl bg-[#0B1C39] text-[#D4A017] flex items-center justify-center shadow-lg shrink-0">
             <Icons.Sparkles />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#0B1C39]">AI Legal Drafter</h1>
            <p className="text-sm text-gray-500">Auto-generate petitions, notices, and legal filings instantly.</p>
          </div>
        </div>

        {/* --- FORM BODY --- */}
        <div className="p-6 md:p-8 space-y-6">
          
          <form onSubmit={generateDraft} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. CUSTOM SEARCHABLE CASE SELECTOR */}
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Select Case File <span className="text-red-500">*</span>
                </label>
                
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border bg-[#F9FAFB] text-left transition-all ${isDropdownOpen ? 'border-[#D4A017] ring-1 ring-[#D4A017]/30' : 'border-gray-200 hover:border-[#D4A017]/50'}`}
                >
                  <span className={`block truncate ${form.caseName ? 'text-[#0B1C39] font-medium' : 'text-gray-400'}`}>
                    {form.caseName || "Search for a case..."}
                  </span>
                  <span className="text-gray-400"><Icons.ChevronDown /></span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animation-fade-in-down">
                    {/* Search Input inside Dropdown */}
                    <div className="p-2 border-b border-gray-100 bg-[#F9FAFB]">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
                        <input
                          autoFocus
                          type="text"
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#D4A017]"
                          placeholder="Type client name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* List */}
                    <div className="max-h-60 overflow-y-auto">
                      {casesLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Loading registry...</div>
                      ) : filteredCases.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No matching cases found.</div>
                      ) : (
                        filteredCases.map((c) => (
                          <div
                            key={c._id}
                            onClick={() => handleSelectCase(c)}
                            className="px-4 py-3 hover:bg-[#D4A017]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                          >
                            <p className="text-[#0B1C39] font-bold text-sm">{c.clientName}</p>
                            <p className="text-gray-500 text-xs mt-0.5">Case No: {c.caseNumber}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DRAFT TYPE SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                   <select
                    value={form.draftType}
                    onChange={(e) => setForm({ ...form, draftType: e.target.value })}
                    required
                    className="w-full appearance-none p-3 rounded-xl border border-gray-200 bg-[#F9FAFB] text-[#0B1C39] font-medium focus:outline-none focus:ring-1 focus:ring-[#D4A017] focus:border-[#D4A017] transition-all"
                  >
                    <option value="" disabled>Select Document...</option>
                    <option value="fir">FIR (First Information Report)</option>
                    <option value="notice">Legal Notice</option>
                    <option value="petition">Writ Petition</option>
                    <option value="civil_complaint">Civil Complaint</option>
                    <option value="bail">Bail Application</option>
                    <option value="affidavit">Affidavit</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icons.ChevronDown />
                  </span>
                </div>
              </div>

            </div>

            {/* 3. EXTRA NOTES */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between">
                <span>Context / Specific Points</span>
                <span className="text-gray-400 font-normal normal-case italic">Optional</span>
              </label>
              <textarea
                rows={5}
                value={form.extraNotes}
                onChange={(e) => setForm({ ...form, extraNotes: e.target.value })}
                placeholder="E.g., The incident occurred on 12th Jan. The client requests immediate injunction..."
                className="w-full p-4 rounded-xl border border-gray-200 bg-[#F9FAFB] text-[#0B1C39] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4A017] focus:border-[#D4A017] transition-all resize-none"
              />
            </div>

            {/* ACTION BUTTON */}
            <button
              disabled={loading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all duration-300
                ${loading 
                  ? "bg-[#F3F4F6] text-gray-400 border border-gray-200 cursor-not-allowed" 
                  : "bg-[#0B1C39] text-white border-2 border-[#0B1C39] hover:bg-[#D4A017] hover:border-[#D4A017] hover:text-[#0B1C39] hover:shadow-xl hover:-translate-y-1"}
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Case Files...</span>
                </>
              ) : (
                <>
                  <Icons.Sparkles />
                  <span>Generate Legal Draft</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}