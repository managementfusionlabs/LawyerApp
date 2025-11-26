"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

export default function CaseViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(data.error);
          setLoading(false);
          return;
        }

        setCaseData(data.case);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Loader text="Loading case..." />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6 text-center text-gray-600">
        Case not found or unauthorized.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#0B1C39]">Case Details</h1>

        <button
          onClick={() => router.push(`/dashboard/cases/edit/${caseData._id}`)}
          className="bg-[#0B1C39] text-white px-4 py-2 rounded-xl text-sm border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg"
        >
          Edit
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6 border space-y-4">

        {/* Client info */}
        <h2 className="text-lg font-semibold mb-2">Client Details</h2>

        <p><span className="font-bold">Client:</span> {caseData.clientName}</p>
        <p><span className="font-bold">Phone:</span> {caseData.phone || "N/A"}</p>
        <p><span className="font-bold">Email:</span> {caseData.email || "N/A"}</p>
        <p><span className="font-bold">Address:</span> {caseData.address || "N/A"}</p>

        <hr />

        {/* Case info */}
        <h2 className="text-lg font-semibold mb-2">Case Information</h2>

        <p><span className="font-bold">Case Number:</span> {caseData.caseNumber || "N/A"}</p>
        <p><span className="font-bold">Case Type:</span> {caseData.caseType || "N/A"}</p>

        <p>
          <span className="font-bold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-xs ${
              caseData.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {caseData.status.toUpperCase()}
          </span>
        </p>

        <p><span className="font-bold">Court Name:</span> {caseData.courtName || "N/A"}</p>

        <p>
          <span className="font-bold">Filing Date:</span>{" "}
          {caseData.filingDate
            ? new Date(caseData.filingDate).toLocaleDateString()
            : "N/A"}
        </p>

        <hr />

        {/* Opponent info */}
        <h2 className="text-lg font-semibold mb-2">Opponent Details</h2>

        <p><span className="font-bold">Opponent Name:</span> {caseData.opponentName || "N/A"}</p>
        <p><span className="font-bold">Opponent Address:</span> {caseData.opponentAddress || "N/A"}</p>

        <hr />

        {/* Description */}
        <p className="text-gray-700">
          <span className="font-bold">Description:</span><br />
          {caseData.description || "N/A"}
        </p>

        <p className="text-xs text-gray-500">
          Created: {new Date(caseData.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Hearings: show only past/heard hearings here. Future hearings appear in Upcoming Hearings page */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Hearings</h2>

        {(!caseData.hearings || caseData.hearings.length === 0) ? (
          <p className="text-gray-600 text-sm">No hearings added yet.</p>
        ) : (
          (() => {
            const startOfToday = new Date();
            startOfToday.setHours(0,0,0,0);
            const pastHearings = caseData.hearings.filter((h) => {
              try {
                return new Date(h.date) < startOfToday;
              } catch (e) {
                return false;
              }
            });

            if (pastHearings.length === 0) {
              return <p className="text-gray-600 text-sm">No past hearings. Upcoming hearings are shown in the Upcoming Hearings page.</p>;
            }

            return (
              <div className="space-y-3">
                {pastHearings.map((h) => (
                  <div key={h._id} className="bg-white border shadow p-4 rounded-lg space-y-1">
                    <p className="font-medium">Date: {new Date(h.date).toLocaleDateString()}</p>
                    {h.court && <p className="text-sm text-gray-700">Court: {h.court}</p>}
                    {h.notes && <p className="text-sm text-gray-600">Notes: {h.notes}</p>}
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

        <button
          onClick={() => setConfirmOpen(true)}
          disabled={solving}
          className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017] disabled:opacity-70 disabled:cursor-wait"
        >
          {solving ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Marking...
            </span>
          ) : (
            "Mark as Solved"
          )}
        </button>

      {/* Confirmation modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { if (!solving) setConfirmOpen(false); }} />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center">
            <h3 className="text-lg font-semibold text-[#0B1C39]">Are you sure?</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to mark this case as solved? This will move it to the Solved list.</p>

            {/* stylish divider */}
            <div className="my-4">
              <div className="h-0.5 bg-gradient-to-r from-[#D4A017] via-transparent to-[#0B1C39] rounded" />
            </div>

            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={async () => {
                  setSolving(true);
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/cases/${caseData._id}/solve`, {
                      method: "PUT",
                      credentials: "include",
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      alert(data.error || "Failed to mark case solved");
                      setSolving(false);
                      return;
                    }

                    setCaseData((c) => ({ ...c, status: "solved" }));
                    setConfirmOpen(false);
                    // navigate to cases list with solved filter
                    router.push("/dashboard/cases?filter=solved");
                  } catch (err) {
                    console.error(err);
                    alert("Server error");
                    setSolving(false);
                  }
                }}
                disabled={solving}
                className="px-4 py-2 rounded-xl bg-[#0B1C39] text-white font-semibold border-2 border-[#D4A017] transition-all duration-200 hover:scale-105 disabled:opacity-70"
              >
                {solving ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Marking...
                  </span>
                ) : (
                  "Yes"
                )}
              </button>

              <button
                onClick={() => { if (!solving) setConfirmOpen(false); }}
                className="px-4 py-2 rounded-xl bg-white text-[#0B1C39] font-semibold border border-[#D4A017] transition-all duration-200 hover:scale-105"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

        <button
          onClick={() =>
            router.push(`/dashboard/hearings/add?case=${caseData._id}`)
          }
          className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017]"
        >
          Add Hearing Date
        </button>

        <button
          onClick={() =>
            router.push(`/dashboard/drafts/create?case=${caseData._id}`)
          }
          className="w-full bg-[#0B1C39] text-white py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg border-2 border-[#D4A017]"
        >
          Generate AI Draft
        </button>

      </div>
    </div>
  );
}
