"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

export default function HearingForm({ caseId }) {
  const [form, setForm] = useState({
    nextHearingDate: "",
    summonNotes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/cases/${caseId}/hearing`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    setLoading(false);

    const data = await res.json();
    console.log("Hearing Updated:", data);
  };

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Summon & Hearing Date</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          name="nextHearingDate"
          value={form.nextHearingDate}
          onChange={handleChange}
        />

        <TextArea
          name="summonNotes"
          placeholder="Summon notes / instructions..."
          value={form.summonNotes}
          onChange={handleChange}
        />
      </div>

      <Button
        className="mt-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Hearing Date"}
      </Button>
    </Card>
  );
}
