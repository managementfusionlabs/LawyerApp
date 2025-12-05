"use client";

import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/auth";
import Loader from "@/components/ui/Loader";
import TextArea from "@/components/ui/TextArea";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example form fields
  const [chamber, setChamber] = useState("");
  const [signature, setSignature] = useState("");

  useEffect(() => {
    fetchMe().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader size={4} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* Heading */}
      <h1 className="text-2xl font-semibold font-serif text-[#0B1C39]">
        Settings
      </h1>

      {/* Account Info Section */}
      <div className="bg-white shadow rounded-xl border-l-4 border-[#D4A017] p-6 space-y-3">
        <h2 className="text-lg font-semibold text-[#0B1C39] font-serif">
          Account Information
        </h2>

        <p className="text-gray-700">
          <span className="font-medium">Name:</span> {user?.name}
        </p>

        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {user?.email}
        </p>

        <p className="text-gray-700">
          <span className="font-medium">User ID:</span> {user?._id}
        </p>
      </div>

      {/* Professional Details Section */}
      <div className="bg-white shadow rounded-xl border-l-4 border-[#D4A017] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#0B1C39] font-serif">
          Professional Details
        </h2>

        <input
          type="text"
          placeholder="Chamber / Office Name"
          value={chamber}
          onChange={(e) => setChamber(e.target.value)}
          className="w-full p-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-[#D4A017] focus:outline-none text-[#0B1C39]"
        />

        <TextArea
          placeholder="Document Signature / Footer Text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button
        className="px-6 py-3 bg-[#0B1C39] text-white rounded-xl border-2 border-[#D4A017]
                  transition-all hover:bg-[#D4A017] hover:text-[#0B1C39] hover:scale-105"
      >
        Save Settings
      </button>
    </div>
  );
}
