"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function CaseForm({ onSubmit }) {
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    email: "",
    address: "",
    caseType: "",
    caseNumber: "",
    courtName: "",
    opponentName: "",
    opponentAddress: "",
    description: "",
    filingDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(form);
        }}
      >
        {/* CLIENT INFO */}
        <div>
          <h2 className="font-semibold text-lg mb-2 font-serif text-[#0B1C39]">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="clientName"
              placeholder="Client Name"
              value={form.clientName}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* CASE DETAILS */}
        <div>
          <h2 className="font-semibold text-lg mb-2 font-serif text-[#0B1C39]">Case Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              name="caseType"
              value={form.caseType}
              onChange={handleChange}
            >
              <option value="">Select Case Type</option>
              <option value="criminal">Criminal</option>
              <option value="civil">Civil</option>
              <option value="family">Family</option>
              <option value="corporate">Corporate</option>
              <option value="property">Property</option>
              <option value="other">Other</option>
            </Select>

            <Input
              name="caseNumber"
              placeholder="Case Number"
              value={form.caseNumber}
              onChange={handleChange}
            />

            <Input
              name="courtName"
              placeholder="Court Name"
              value={form.courtName}
              onChange={handleChange}
            />

            <Input
              name="filingDate"
              type="date"
              placeholder="Filing Date"
              value={form.filingDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* OPPOSING PARTY */}
        <div>
          <h2 className="font-semibold text-lg mb-2 font-serif text-[#0B1C39]">Opposing Party</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="opponentName"
              placeholder="Opponent Name"
              value={form.opponentName}
              onChange={handleChange}
            />
            <Input
              name="opponentAddress"
              placeholder="Opponent Address"
              value={form.opponentAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <h2 className="font-semibold text-lg mb-2 font-serif text-[#0B1C39]">Case Description</h2>
          <TextArea
            name="description"
            placeholder="Enter detailed case description..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* EVIDENCE UPLOAD */}
        <div>
          <h2 className="font-semibold text-lg mb-2 font-serif text-[#0B1C39]">Evidence (Optional)</h2>
          <input
            type="file"
            multiple
            className="block w-full border p-2 rounded-lg"
          />
        </div>

        {/* SUBMIT */}
        <Button type="submit" className="mt-4">
          Create Case
        </Button>
      </form>
    </Card>
  );
}
