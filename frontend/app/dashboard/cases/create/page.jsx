"use client";

import { useState } from "react";
import FloatingInput from "@/components/ui/FloatingInput";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";

export default function CreateCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // MATCHED EXACTLY WITH Case.js SCHEMA
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    email: "",
    address: "",

    caseType: "",
    caseNumber: "",
    courtName: "",
    filingDate: "",

    opponentName: "",
    opponentAddress: "",

    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Failed to create case");
        return;
      }

      router.push(`/dashboard/cases/${data._id}`);
    } catch (err) {
      console.log(err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold font-serif mb-6 text-[#0B1C39]">Create New Case</h1>

      <form onSubmit={submitForm} className="space-y-6 mb-10">

        {/* Client Name */}
        <FloatingInput
          name="clientName"
          label="Client Name"
          value={form.clientName}
          onChange={handleChange}
          required
        />

        {/* Phone */}
        <FloatingInput
          name="phone"
          label="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />

        {/* Email */}
        <FloatingInput
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
        />

        {/* Address */}
        <FloatingInput
          name="address"
          label="Client Address"
          value={form.address}
          onChange={handleChange}
        />

        {/* Case Number */}
        <FloatingInput
          name="caseNumber"
          label="Case Number"
          value={form.caseNumber}
          onChange={handleChange}
        />

        {/* Case Type */}
        <Select
          name="caseType"
          label="Case Type"
          value={form.caseType}
          onChange={handleChange}
          required
          options={[
            { label: "Select Type", value: "" },
            { label: "Civil", value: "civil" },
            { label: "Criminal", value: "criminal" },
            { label: "Family", value: "family" },
            { label: "Property", value: "property" },
            { label: "Financial", value: "financial" },
            { label: "Contract", value: "contract" },
          ]}
        />

        {/* Court Name */}
        <FloatingInput
          name="courtName"
          label="Court Name"
          value={form.courtName}
          onChange={handleChange}
        />

        {/* Filing Date */}
        <div>
          <label className="text-sm font-medium">Filing Date</label>
          <input
            type="date"
            name="filingDate"
            value={form.filingDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-gray-50 mt-1 focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] outline-none"
          />
        </div>

        {/* Opponent Name */}
        <FloatingInput
          name="opponentName"
          label="Opponent Name"
          value={form.opponentName}
          onChange={handleChange}
        />

        {/* Opponent Address */}
        <FloatingInput
          name="opponentAddress"
          label="Opponent Address"
          value={form.opponentAddress}
          onChange={handleChange}
        />

        {/* Description */}
        <TextArea
          name="description"
          placeholder="Case Description"
          label="Case Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        {/* Submit */}
        <button
          className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017]"
          disabled={loading}
        >
          {loading ? <Loader text="Creating Case..." /> : "Create Case"}
        </button>

      </form>
    </div>
  );
}
