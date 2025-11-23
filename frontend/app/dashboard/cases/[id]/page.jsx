"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";

export default function CaseViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        <h1 className="text-xl md:text-2xl font-bold">Case Details</h1>

        <button
          onClick={() => router.push(`/dashboard/cases/edit/${caseData._id}`)}
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
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

      {/* Hearings */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Hearings</h2>

        {!caseData.hearings || caseData.hearings.length === 0 ? (
          <p className="text-gray-600 text-sm">No hearings added yet.</p>
        ) : (
          <div className="space-y-3">
            {caseData.hearings.map((h) => (
              <div
                key={h._id}
                className="bg-white border shadow p-4 rounded-lg space-y-1"
              >
                <p className="font-medium">
                  Date: {new Date(h.date).toLocaleDateString()}
                </p>

                {h.court && (
                  <p className="text-sm text-gray-700">Court: {h.court}</p>
                )}

                {h.notes && (
                  <p className="text-sm text-gray-600">Notes: {h.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

       <button
  onClick={async () => {
    if (!confirm("Mark this case as solved?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/cases/${caseData._id}/solve`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to mark solved");
        return;
      }

      alert("Case marked as solved");
      router.refresh(); // reload page
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  }}
  className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold"
>
  Mark as Solved
</button>

        <button
          onClick={() =>
            router.push(`/dashboard/hearings/add?case=${caseData._id}`)
          }
          className="w-full bg-black text-white py-3 rounded-lg font-semibold"
        >
          Add Hearing Date
        </button>

        <button
          onClick={() =>
            router.push(`/dashboard/drafts/create?case=${caseData._id}`)
          }
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold"
        >
          Generate AI Draft
        </button>
        <button
  onClick={() => setShowDeleteModal(true)}
  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
>
  Delete Case
</button>




<Modal show={showDeleteModal}>
  <h2 className="text-lg font-bold mb-4">Delete Case</h2>
  <p className="text-gray-700 mb-6">
    Are you sure you want to delete this case? This action cannot be undone.
  </p>

  <div className="flex justify-end gap-3">
    <button
      onClick={() => setShowDeleteModal(false)}
      className="px-4 py-2 bg-gray-200 rounded-md"
    >
      Cancel
    </button>

    <button
      onClick={async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API}/cases/${caseData._id}`,
            { method: "DELETE", credentials: "include" }
          );

          const data = await res.json();

          if (!res.ok) {
            alert(data.error || "Failed to delete case");
            return;
          }

          alert("Case deleted successfully");
          router.push("/dashboard/cases");
        } catch (err) {
          console.log(err);
          alert("Server error");
        }
      }}
      className="px-4 py-2 bg-red-600 text-white rounded-md"
    >
      Yes, Delete
    </button>
  </div>
</Modal>


      </div>
      
      
    </div>
  );
}
