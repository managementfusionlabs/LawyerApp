"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import Loader from "@/components/ui/Loader";

export default function AIDraftGenerator() {
  const params = useSearchParams();
  const router = useRouter();

  const caseId = params.get("case");

  const [loading, setLoading] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [form, setForm] = useState({
    draftType: "",
    extraNotes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateDraft = async (e) => {
    e.preventDefault();

    if (!caseId) {
      alert("Invalid case ID");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts/case/${caseId}/generate`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "AI failed to generate draft");
        return;
      }

      // Redirect to AI-generated draft page
      router.push(`/dashboard/drafts/${data.draft._id}?success=generated`);
    } catch (err) {
      console.log(err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold font-serif mb-6 text-[#0B1C39]">Generate AI Draft</h1>

      <form onSubmit={generateDraft} className="space-y-6">
        <Select
          name="draftType"
          label="Draft Type"
          value={form.draftType}
          onChange={handleChange}
          required
          options={[
            { label: "Select Draft Type", value: "" },
            { label: "FIR Draft", value: "fir" },
            { label: "Legal Notice", value: "notice" },
            { label: "Petition", value: "petition" },
            { label: "Civil Complaint", value: "civil_complaint" },
            { label: "Bail Application", value: "bail" },
          ]}
        />

        <TextArea name="extraNotes" label="Additional Notes (optional)" value={form.extraNotes} onChange={handleChange} />

        <button
          disabled={loading}
          className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017]"
        >
          {loading ? <Loader text="Generating Draft..." /> : "Generate Draft"}
        </button>
      </form>

      {draftText && (
        <div className="mt-10 bg-white rounded-xl shadow p-6 border-l-4 border-[#D4A017]">
          <h2 className="text-xl font-bold mb-4">Generated Draft</h2>

          <pre className="whitespace-pre-wrap text-gray-700">{draftText}</pre>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push(`/dashboard/drafts/save?case=${caseId}&draft=${encodeURIComponent(draftText)}`)}
              className="flex-1 bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg"
            >
              Save Draft
            </button>

            <button
              onClick={() => router.push(`/dashboard/drafts/pdf?text=${encodeURIComponent(draftText)}`)}
              className="flex-1 bg-white text-[#0B1C39] py-3 rounded-xl font-semibold border border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-sm"
            >
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
