"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";

// TinyMCE (dynamically imported to avoid SSR issues)
const Editor = dynamic(() => import("@tinymce/tinymce-react").then(m => m.Editor), {
  ssr: false,
});

export default function DraftViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState("");

  // Fetch Draft
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
        setEditableText(data.draft.content || data.draft.draftText || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Save Edited Draft
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editableText }),
      });

      if (!res.ok) {
        alert("Failed to update draft");
        return;
      }

      const updated = await res.json();
      setDraft(updated.draft);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Delete Draft
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
      alert("Server error");
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 flex justify-center">
        <Loader text="Loading draft..." />
      </div>
    );

  if (!draft)
    return <div className="p-6 text-gray-600">Draft not found or unauthorized.</div>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold font-serif text-[#0B1C39]">
            {draft.draftType || "Draft"}
          </h1>
          <p className="text-sm text-gray-600">Case: {draft.caseId || "—"}</p>
          <p className="text-xs text-gray-500 mt-1">
            Created: {new Date(draft.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={`${process.env.NEXT_PUBLIC_API}/drafts/case/${draft.caseId}/pdf`}
            className="bg-[#0B1C39] text-white px-3 py-2 rounded-xl text-sm border-2 border-[#D4A017] shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg"
          >
            Export PDF
          </a>

          <button
            onClick={() => setEditMode(prev => !prev)}
            className="bg-gray-200 text-[#0B1C39] px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-105 hover:shadow"
          >
            {editMode ? "Cancel Edit" : "Edit"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-3 py-2 rounded-xl text-sm transition-all duration-200 transform-gpu hover:scale-105 hover:shadow-lg disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Draft Content / Editor */}
      <div className="bg-white rounded-xl p-6 shadow border-l-4 border-[#D4A017]">
        {editMode ? (
          <Editor
            apiKey="82dg3f2c02s09x1fu1yb40edpy7ka7fozgzueagvldi2e9tp" // optional
            value={editableText}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic underline forecolor backcolor | " +
                "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                "image table | removeformat | fullscreen | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:16px; }",
            }}
            onEditorChange={(content) => setEditableText(content)}
          />
        ) : (
          <div
            className="prose max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: draft.content }}
          />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 grid md:grid-cols-3 gap-3">
        {editMode ? (
          <button
            onClick={handleSaveEdit}
            className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm border-2 border-[#D4A017] transition-all duration-200 hover:scale-105 hover:bg-[#D4A017] hover:text-[#0B1C39]"
          >
            Save Changes
          </button>
        ) : (
          <>
            <button
              onClick={() =>
                router.push(
                  `/dashboard/drafts/save?case=${draft.caseId}&draft=${encodeURIComponent(
                    draft.content
                  )}`
                )
              }
              className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm border-2 border-[#D4A017] transition-all duration-200 hover:scale-105 hover:bg-[#D4A017] hover:text-[#0B1C39]"
            >
              Save as New Draft
            </button>

            <button
              onClick={() =>
                router.push(
                  `/dashboard/drafts/pdf?text=${encodeURIComponent(
                    draft.content
                  )}`
                )
              }
              className="w-full bg-white text-[#0B1C39] py-3 rounded-xl font-semibold border border-[#D4A017] transition-all duration-200 hover:scale-105 hover:bg-[#D4A017] hover:text-[#0B1C39]"
            >
              Preview PDF
            </button>

            <button
              onClick={() => router.push(`/dashboard/cases/${draft.caseId}`)}
              className="w-full bg-white text-gray-800 py-3 rounded-xl font-semibold border border-gray-200 transition-all duration-200 hover:scale-105 hover:bg-[#D4A017] hover:text-[#0B1C39]"
            >
              Go to Case
            </button>
          </>
        )}
      </div>
    </div>
  );
}
