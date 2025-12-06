"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Loader from "@/components/ui/Loader";

export default function AIDraftGenerator() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [casesLoading, setCasesLoading] = useState(true);

  const [caseList, setCaseList] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    caseId: "",
    draftType: "",
    extraNotes: "",
  });

  // Fetch cases for dropdown
useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/my-cases`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // backend returns ARRAY directly
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


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Filter based on search
const filteredCases = (caseList || []).filter((c) =>
  (c.clientName || "").toLowerCase().includes(search.toLowerCase()) ||
  (c.caseNumber || "").toLowerCase().includes(search.toLowerCase())
);


  const generateDraft = async (e) => {
    e.preventDefault();

    if (!form.caseId) {
      alert("Please select a case");
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
    <div className="p-4 md:p-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold font-serif mb-6 text-[#0B1C39]">
        Generate AI Draft
      </h1>

      <form onSubmit={generateDraft} className="space-y-6">
        {/* SEARCHABLE CASE SELECT FIELD */}
        <div>
          <label className="block font-medium text-[#0B1C39] mb-2">
            Select Case <span className="text-red-500">*</span>
          </label>

          {/* Search box */}
          <Input
            placeholder="Search case by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Cases dropdown */}
          {casesLoading ? (
            <div className="mt-2"><Loader text="Loading cases..." /></div>
          ) : (
            <select
              name="caseId"
              value={form.caseId}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl p-3 bg-white text-base text-[#0B1C39] mt-3 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
            >
              <option value="">Select Case</option>

              {filteredCases.length === 0 ? (
                <option disabled>No cases found</option>
              ) : (
                filteredCases.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.clientName} — {c.caseNumber}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {/* Draft Type */}
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

        <TextArea
          name="extraNotes"
          label="Additional Notes (optional)"
          placeholder="Any specific points you want to include in the draft..."
          value={form.extraNotes}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:bg-[#D4A017] hover:text-[#0B1C39] border-2 border-[#D4A017]"
        >
          {loading ? <Loader text="Generating Draft..." /> : "Generate Draft"}
        </button>
      </form>
    </div>
  );
}
