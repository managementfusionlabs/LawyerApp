"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

export default function DraftViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setDraft(data.draft);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this draft?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        alert("Failed to delete");
        setDeleting(false);
        return;
      }
      router.push("/dashboard/drafts");
    } catch (err) {
      console.error(err);
      setDeleting(false);
      alert("Server error");
    }
  };

  if (loading) return <div className="p-6 flex justify-center"><Loader text="Loading draft..." /></div>;
  if (!draft) return <div className="p-6 text-gray-600">Draft not found or unauthorized.</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold">{draft.draftType || "Draft"}</h1>
          <p className="text-sm text-gray-600">Case: {draft.caseId || "—"}</p>
          <p className="text-xs text-gray-500 mt-1">Created: {new Date(draft.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex gap-2">
          <a
            href={`${process.env.NEXT_PUBLIC_API}/drafts/case/${draft.caseId}/pdf`}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm"
          >
            Export PDF
          </a>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-2 rounded text-sm"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border">
        <pre className="whitespace-pre-wrap text-gray-800"> {draft.content || draft.draftText}</pre>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-3">
        <button
          onClick={() => router.push(`/dashboard/drafts/save?case=${draft.caseId}&draft=${encodeURIComponent(draft.content)}`)}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold"
        >
          Save as New Draft
        </button>

        <button
          onClick={() => router.push(`/dashboard/drafts/pdf?text=${encodeURIComponent(draft.content)}`)}
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold"
        >
          Preview PDF
        </button>

        <button
          onClick={() => router.push(`/dashboard/cases/${draft.caseId}`)}
          className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold"
        >
          Go to Case
        </button>
      </div>
    </div>
  );
}
