"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import FloatingInput from "@/components/ui/FloatingInput";
import TextArea from "@/components/ui/TextArea";
import Loader from "@/components/ui/Loader";

export default function AddHearingPage() {
  const params = useSearchParams();
  const router = useRouter();

  const caseId = params.get("case");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: "",
    court: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/hearings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          ...form,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Failed to add hearing");
        return;
      }

      router.push(`/dashboard/cases/${caseId}`);
    } catch (err) {
      console.log(err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold font-serif mb-6 text-[#0B1C39]">Add Hearing Date</h1>

      <form onSubmit={submit} className="space-y-6">
        {/* Hearing Date */}
        <div>
          <label className="text-sm font-medium">Hearing Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md bg-gray-50 mt-1 focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] outline-none"
          />
        </div>

        {/* Court Name */}
        <FloatingInput
          name="court"
          label="Court Name"
          value={form.court}
          onChange={handleChange}
        />

        {/* Notes */}
        <FloatingInput
          name="notes"
          label="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg"
        >
          {loading ? <Loader text="Adding Hearing..." /> : "Add Hearing"}
        </button>
      </form>
    </div>
  );
}
