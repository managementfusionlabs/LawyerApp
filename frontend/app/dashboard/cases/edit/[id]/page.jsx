"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FloatingInput from "@/components/ui/FloatingInput";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";

export default function EditCasePage() {
  const { id } = useParams();
  const router = useRouter();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${id}`, {
          credentials: "include",
        });

        const data = await res.json();
        setCaseData(data.case);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const handleChange = (e) => {
    setCaseData({ ...caseData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseData),
      });

      const data = await res.json();
      setSaveLoading(false);

      if (!res.ok) {
        alert(data.error || "Failed to update case");
        return;
      }

      router.push(`/dashboard/cases/${id}`);
    } catch (err) {
      console.log(err);
      setSaveLoading(false);
      alert("Server error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Loader text="Loading case..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Case</h1>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Case Number */}
        <FloatingInput
          name="caseNumber"
          label="Case Number"
          value={caseData.caseNumber}
          onChange={handleChange}
          required
        />

        {/* Case Type */}
        <Select
          name="caseType"
          label="Case Type"
          value={caseData.caseType}
          onChange={handleChange}
          options={[
            { label: "Civil", value: "civil" },
            { label: "Criminal", value: "criminal" },
            { label: "Family", value: "family" },
            { label: "Property", value: "property" },
            { label: "Financial", value: "financial" },
            { label: "Contract", value: "contract" },
          ]}
        />

        {/* Client Name */}
        <FloatingInput
          name="clientName"
          label="Client Name"
          value={caseData.clientName}
          onChange={handleChange}
          required
        />

        {/* Phone */}
        <FloatingInput
          name="phone"
          label="Phone Number"
          value={caseData.phone}
          onChange={handleChange}
        />

        {/* Email */}
        <FloatingInput
          name="email"
          label="Email"
          value={caseData.email}
          onChange={handleChange}
        />

        {/* Address */}
        <FloatingInput
          name="address"
          label="Client Address"
          value={caseData.address}
          onChange={handleChange}
        />

        {/* Court Name */}
        <FloatingInput
          name="courtName"
          label="Court Name"
          value={caseData.courtName}
          onChange={handleChange}
        />

        {/* Filing Date */}
        <div>
          <label className="text-sm font-medium">Filing Date</label>
          <input
            type="date"
            name="filingDate"
            value={caseData.filingDate || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-gray-50 mt-1 focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        {/* Opponent Name */}
        <FloatingInput
          name="opponentName"
          label="Opponent Name"
          value={caseData.opponentName}
          onChange={handleChange}
        />

        {/* Opponent Address */}
        <FloatingInput
          name="opponentAddress"
          label="Opponent Address"
          value={caseData.opponentAddress}
          onChange={handleChange}
        />

        {/* Description */}
        <TextArea
          name="description"
          label="Case Description"
          value={caseData.description}
          onChange={handleChange}
          required
        />

        <button
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          disabled={saveLoading}
        >
          {saveLoading ? <Loader text="Saving..." /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
