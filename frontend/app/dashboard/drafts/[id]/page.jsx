"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";

// TinyMCE (dynamically imported)
const Editor = dynamic(() => import("@tinymce/tinymce-react").then(m => m.Editor), {
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-gray-50 text-gray-400">Loading Editor...</div>
});

// --- CUSTOM ICONS ---
const Icons = {
  ArrowLeft: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  ExternalLink: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>,
  ChevronUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
};

export default function DraftViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // States for Edit Mode & View Mode
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState("");
  
  // State for "Read More" functionality
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch Draft
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/${id}`, { credentials: "include" });
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();
        setDraft(data.draft);
        setEditableText(data.draft.content || data.draft.draftText || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Save Edit
  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editableText }),
      });
      if (!res.ok) { alert("Failed to update draft"); setSaving(false); return; }
      const updated = await res.json();
      setDraft(updated.draft);
      setEditMode(false);
      setIsExpanded(true); // Auto-expand after saving to see result
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!confirm("Permanently delete this draft?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) { alert("Failed to delete"); setDeleting(false); return; }
      router.push("/dashboard/drafts");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center"><Loader size={4} /><p className="mt-4 text-[#0B1C39] font-medium">Loading Document...</p></div>;
  if (!draft) return <div className="p-10 text-center">Draft not found.</div>;

  return (
    <div className="w-dvw  mx-auto pr-10 md:p-8 space-y-6 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/dashboard/drafts")} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <Icons.ArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#0B1C39]">{draft.draftType || "Legal Draft"}</h1>
          <p className="text-xs text-gray-400">Associated Case: {draft.caseId || "N/A"}</p>
        </div>
      </div>

      {/* --- TOP ACTIONS CARD (Horizontal Row) --- */}
      <div className="bg-[#0B1C39] rounded-xl shadow-xl p-5 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017] opacity-10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none"></div>

        <div className="flex items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-[#D4A017]"></span>
          <span className="text-xs font-bold text-[#D4A017] uppercase tracking-widest">Draft Actions</span>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          {editMode ? (
            <>
               <button onClick={handleSaveEdit} disabled={saving} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#D4A017] text-[#0B1C39] px-6 py-2 rounded-lg font-bold hover:bg-[#b88a10] transition-colors shadow-lg">
                 {saving ? "Saving..." : <><Icons.Save /> Save Changes</>}
               </button>
               <button onClick={() => setEditMode(false)} className="flex-1 md:flex-none px-6 py-2 rounded-lg font-bold bg-white/10 hover:bg-white/20 transition-colors">
                 Cancel
               </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#D4A017] hover:text-[#0B1C39] transition-all border border-white/10">
                <Icons.Edit /> <span>Edit</span>
              </button>
              
              <a href={`${process.env.NEXT_PUBLIC_API}/drafts/case/${draft.caseId}/pdf`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#D4A017] hover:text-[#0B1C39] transition-all border border-white/10">
                <Icons.Download /> <span>PDF</span>
              </a>

              <button onClick={() => router.push(`/dashboard/cases/${draft.caseId}`)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-[#D4A017] hover:text-[#0B1C39] transition-all border border-white/10">
                <Icons.ExternalLink /> <span>Case File</span>
              </button>

              <button onClick={handleDelete} disabled={deleting} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/30 transition-all border border-transparent hover:border-red-500/30">
                <Icons.Trash /> <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- DOCUMENT PAPER --- */}
      <div className={`
        bg-white rounded-t-sm shadow-xl border-t-4 transition-all duration-300 relative
        ${editMode ? "border-[#D4A017] ring-4 ring-[#D4A017]/10" : "border-[#0B1C39]"}
      `}>
        
        {/* Document Header Bar */}
        <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {editMode ? "Editing Mode" : "Preview Mode"}
          </span>
        </div>

        {/* Content Area */}
        <div className="relative">
          
          {editMode ? (
            /* --- EDIT MODE (Always Full Height) --- */
            <div className="p-6 md:p-8">
              <Editor
                apiKey="82dg3f2c02s09x1fu1yb40edpy7ka7fozgzueagvldi2e9tp"
                value={editableText}
                init={{
                  height: 600,
                  menubar: false,
                  plugins: ["lists", "link", "image", "table", "help", "wordcount"],
                  toolbar: "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | removeformat",
                  content_style: "body { font-family:'Times New Roman', serif; font-size:14pt; line-height: 1.6; color: #000; }",
                }}
                onEditorChange={(content) => setEditableText(content)}
              />
            </div>
          ) : (
            /* --- READ ONLY MODE (Truncated) --- */
            <div className="flex flex-col">
              
              {/* Text Container with dynamic max-height */}
              <div 
                className={`
                  prose max-w-none text-black font-serif leading-loose p-8 md:p-12 transition-all duration-500 ease-in-out
                  ${isExpanded ? "max-h-full" : "max-h-[400px] overflow-hidden"}
                `}
                style={{ fontSize: '14pt' }}
              >
                 <div dangerouslySetInnerHTML={{ __html: draft.content }} />
              </div>

              {/* Gradient Overlay (Only visible if collapsed) */}
              {!isExpanded && (
                <div className="absolute top-[200px] left-0 w-full h-[200px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
              )}

              {/* Show More / Show Less Button */}
              <div className="w-full flex justify-center pb-8 pt-4 bg-white relative z-10 border-t border-gray-50 mt-auto">
                 <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#F3F4F6] text-[#0B1C39] text-sm font-bold hover:bg-[#D4A017] hover:text-[#0B1C39] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                 >
                   {isExpanded ? (
                     <>Show Less <Icons.ChevronUp /></>
                   ) : (
                     <>Read Full Draft <Icons.ChevronDown /></>
                   )}
                 </button>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}