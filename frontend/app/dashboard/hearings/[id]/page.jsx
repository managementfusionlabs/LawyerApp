"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

export default function HearingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hearing, setHearing] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // load upcoming hearings and find the one with id
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/hearings/upcoming`, { credentials: "include" });
        const data = await res.json();
        const found = Array.isArray(data.hearings) ? data.hearings.find((h) => h._id === id) : null;
        if (!mounted) return;
        if (!found) {
          setLoading(false);
          return;
        }
        setHearing(found);

        // fetch the case details to show full case info
        try {
          const caseRes = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${found.caseId}`, { credentials: "include" });
          if (caseRes.ok) {
            const caseJson = await caseRes.json();
            if (mounted) setCaseData(caseJson.case || caseJson);
          }
        } catch (err) {
          console.error("Failed to load case for hearing detail", err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div className="p-6 flex justify-center"><Loader text="Loading hearing..." /></div>;

  if (!hearing) return <div className="p-6 text-gray-600">Hearing not found.</div>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold font-serif text-[#0B1C39]">Hearing Details</h1>
      </div>

      <div className="bg-white rounded-xl p-6 shadow border-l-4 border-[#D4A017]">
        <p className="text-sm text-gray-600">Date</p>
        <p className="font-medium text-[#0B1C39] mb-3">{hearing.date ? new Date(hearing.date).toLocaleString() : "—"}</p>

        <p className="text-sm text-gray-600">Court</p>
        <p className="font-medium text-[#0B1C39] mb-3">{hearing.court || "—"}</p>

        {hearing.notes && (
          <>
            <p className="text-sm text-gray-600">Notes</p>
            <p className="text-gray-700 mb-3">{hearing.notes}</p>
          </>
        )}

        <hr className="my-4" />

        <h2 className="text-lg font-semibold mb-2">Case Details</h2>
        {caseData ? (
          <div className="space-y-1 text-sm text-gray-700">
            <p className="font-semibold text-[#0B1C39]">{caseData.caseNumber || caseData._id}</p>
            <p>{caseData.clientName}</p>
            <p className="text-xs text-gray-500">Created: {caseData.createdAt ? new Date(caseData.createdAt).toLocaleString() : "—"}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/cases/${caseData._id}`)}
                    className="px-4 py-2 rounded-xl bg-[#0B1C39] text-white border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] shadow-sm"
                  >
                    Open Case
                  </button>

                  <button
                    onClick={() => router.push(`/dashboard/hearings`)}
                    className="px-4 py-2 rounded-xl bg-white text-[#0B1C39] border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:bg-[#0B1C39] hover:text-white"
                  >
                    Close
                  </button>
                </div>
          </div>
        ) : (
          <p className="text-gray-600">Case details unavailable.</p>
        )}
      </div>
    </div>
  );
}
