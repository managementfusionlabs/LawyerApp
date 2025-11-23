"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/ui/Loader";

export default function SaveDraftPage() {
  const params = useSearchParams();
  const router = useRouter();

  const caseId = params.get("case");
  const draft = params.get("draft");

  const [loading, setLoading] = useState(false);

  const saveDraft = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/save`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          draftType: "generated",
          content: draft,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Failed to save draft");
        return;
      }

      router.push(`/dashboard/drafts/${data.draft._id}`);
    } catch (err) {
      console.log(err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Save Draft</h1>
      <p className="text-gray-600 mt-3">Do you want to save this draft?</p>

      <button
        onClick={saveDraft}
        disabled={loading}
        className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold"
      >
        {loading ? <Loader text="Saving..." /> : "Save Draft"}
      </button>
    </div>
  );
}
