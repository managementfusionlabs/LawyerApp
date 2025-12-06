"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

// --- CUSTOM PREMIUM ICONS ---
const Icons = {
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Building: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Gavel: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Mail: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  File: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
};

export default function CaseViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(data.error);
          setLoading(false);
          return;
        }
        setCaseData(data.case);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size={4} />
        <p className="mt-4 text-[#0B1C39] font-medium animate-pulse">Retrieving Case Files...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-300 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold text-[#0B1C39]">Case Not Found</h3>
        <p className="text-gray-500 mt-2">The requested case file is unavailable or unauthorized.</p>
        <button onClick={() => router.push('/dashboard/cases')} className="mt-4 text-[#D4A017] hover:underline">Return to Registry</button>
      </div>
    );
  }

  // Helper to filter past hearings
  const getPastHearings = () => {
    if (!caseData.hearings || caseData.hearings.length === 0) return [];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return caseData.hearings.filter((h) => {
      try { return new Date(h.date) < startOfToday; } catch (e) { return false; }
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending
  };

  const pastHearings = getPastHearings();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#D4A017]/20 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <span className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border
                ${caseData.status === "active" 
                  ? "bg-[#0B1C39] text-[#D4A017] border-[#D4A017]" 
                  : "bg-green-100 text-green-700 border-green-200"}
             `}>
               {caseData.status}
             </span>
             <span className="text-gray-400 text-sm flex items-center gap-1">
               <Icons.Calendar />
               Filed: {new Date(caseData.filingDate).toLocaleDateString()}
             </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#0B1C39] leading-tight">
            Case {caseData.caseNumber}
          </h1>
          <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
            <span className="text-[#D4A017]"><Icons.Building /></span>
            {caseData.courtName}
          </p>
        </div>

        <button
          onClick={() => router.push(`/dashboard/cases/edit/${caseData._id}`)}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#0B1C39] hover:border-[#D4A017] hover:bg-[#D4A017]/10 transition-all shadow-sm"
        >
          <Icons.Edit />
          <span className="font-medium">Edit Details</span>
        </button>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT COLUMN (2/3) === */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. DESCRIPTION CARD */}
          <section className="bg-white rounded-2xl p-6 border border-[#D4A017]/20 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#D4A017]"></div>
             <h2 className="font-serif font-bold text-lg text-[#0B1C39] mb-4 flex items-center gap-2">
               <span className="text-[#D4A017]"><Icons.File /></span> Case Brief
             </h2>
             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
               {caseData.description || "No description provided for this case."}
             </p>
             <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
                <span>Type: {caseData.caseType}</span>
                <span>•</span>
                <span>ID: {caseData._id}</span>
             </div>
          </section>

          {/* 2. PARTIES (VERSUS) CARD */}
          <section className="bg-white rounded-2xl border border-[#D4A017]/20 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
               <h2 className="font-serif font-bold text-[#0B1C39]">Legal Parties</h2>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
               {/* Client Side */}
               <div className="flex-1 w-full text-center md:text-left">
                  <p className="text-xs font-bold text-[#D4A017] uppercase tracking-wider mb-1">Petitioner / Client</p>
                  <h3 className="text-xl font-bold text-[#0B1C39]">{caseData.clientName}</h3>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                     {caseData.phone && <div className="flex items-center justify-center md:justify-start gap-2"><Icons.Phone /> {caseData.phone}</div>}
                     {caseData.email && <div className="flex items-center justify-center md:justify-start gap-2"><Icons.Mail /> {caseData.email}</div>}
                     <p className="text-xs text-gray-400 mt-1">{caseData.address}</p>
                  </div>
               </div>

               {/* VS Divider */}
               <div className="shrink-0 relative">
                  <div className="w-10 h-10 rounded-full bg-[#0B1C39] text-[#D4A017] flex items-center justify-center font-serif font-bold italic border-2 border-[#D4A017] z-10 relative">
                    VS
                  </div>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
               </div>

               {/* Opponent Side */}
               <div className="flex-1 w-full text-center md:text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Respondent / Opponent</p>
                  <h3 className="text-xl font-bold text-gray-700">{caseData.opponentName}</h3>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                     <p className="text-xs text-gray-400 mt-1">{caseData.opponentAddress || "Address not on file"}</p>
                  </div>
               </div>
            </div>
          </section>

          {/* 3. HEARINGS TIMELINE */}
          <section className="bg-white rounded-2xl border border-[#D4A017]/20 shadow-sm overflow-hidden">
             <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
               <h2 className="font-serif font-bold text-[#0B1C39]">Hearing History</h2>
               <span className="text-xs text-gray-400">Past hearings only</span>
            </div>
            <div className="p-6">
              {pastHearings.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No past hearings recorded. Future hearings are tracked in the Calendar.
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {pastHearings.map((h, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      
                      {/* Icon/Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-100 group-hover:bg-[#D4A017] group-hover:text-[#0B1C39] text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                        <Icons.Gavel />
                      </div>
                      
                      {/* Content Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-[#D4A017]/30 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <time className="font-bold text-[#0B1C39] text-sm">{new Date(h.date).toLocaleDateString()}</time>
                        </div>
                        <p className="text-sm text-gray-600 leading-snug">
                          {h.notes || "No notes recorded."}
                        </p>
                        {h.court && <p className="text-xs text-[#D4A017] mt-2 font-medium">{h.court}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>

        {/* === RIGHT COLUMN (1/3) - ACTIONS === */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="sticky top-24 space-y-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-[#0B1C39] rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
               {/* Decorative background */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017] opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
               
               <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#D4A017]"></span> Actions
               </h3>

               <div className="space-y-3">
                  {/* Mark Solved */}
                  <button
                    onClick={() => setConfirmOpen(true)}
                    disabled={solving || caseData.status === 'solved'}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-[#D4A017] hover:text-[#0B1C39] border border-white/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="font-medium text-sm">{caseData.status === 'solved' ? "Case Closed" : "Mark as Solved"}</span>
                    {solving ? (
                      <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                    ) : (
                      <span className="text-[#D4A017] group-hover:text-[#0B1C39]"><Icons.Check /></span>
                    )}
                  </button>

                  {/* Add Hearing */}
                  <button
                    onClick={() => router.push(`/dashboard/hearings/add?case=${caseData._id}`)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-[#D4A017] hover:text-[#0B1C39] border border-white/20 transition-all duration-300 group"
                  >
                    <span className="font-medium text-sm">Add Hearing Date</span>
                    <span className="text-[#D4A017] group-hover:text-[#0B1C39]"><Icons.Plus /></span>
                  </button>

                  {/* Generate Draft */}
                  <button
                    onClick={() => router.push(`/dashboard/drafts/create?case=${caseData._id}`)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-[#D4A017] hover:text-[#0B1C39] border border-white/20 transition-all duration-300 group"
                  >
                    <span className="font-medium text-sm">Generate AI Draft</span>
                    <span className="text-[#D4A017] group-hover:text-[#0B1C39]"><Icons.File /></span>
                  </button>
               </div>
            </div>

            {/* Meta Info Small Card */}
            <div className="bg-[#F8F8F8] rounded-xl p-5 border border-gray-200 text-sm text-gray-500">
               <p>Created: {new Date(caseData.createdAt).toLocaleString()}</p>
               <p className="mt-1">Last Updated: {new Date(caseData.updatedAt || caseData.createdAt).toLocaleString()}</p>
            </div>

          </div>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => { if (!solving) setConfirmOpen(false); }} />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center border border-[#D4A017]/20 transform transition-all scale-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Check />
            </div>
            
            <h3 className="text-2xl font-serif font-bold text-[#0B1C39]">Close this Case?</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Are you sure you want to mark <strong>{caseData.caseNumber}</strong> as solved? This will move it to the archives.
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => { if (!solving) setConfirmOpen(false); }}
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setSolving(true);
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${caseData._id}/solve`, {
                      method: "PUT",
                      credentials: "include",
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      alert(data.error || "Failed to mark case solved");
                      setSolving(false);
                      return;
                    }
                    setCaseData((c) => ({ ...c, status: "solved" }));
                    setConfirmOpen(false);
                    router.push("/dashboard/cases?filter=solved");
                  } catch (err) {
                    console.error(err);
                    alert("Server error");
                    setSolving(false);
                  }
                }}
                disabled={solving}
                className="px-6 py-2.5 rounded-xl bg-[#0B1C39] text-white font-semibold border-2 border-[#0B1C39] hover:bg-[#D4A017] hover:border-[#D4A017] hover:text-[#0B1C39] transition-all shadow-lg flex items-center gap-2"
              >
                {solving ? "Processing..." : "Yes, Close Case"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}