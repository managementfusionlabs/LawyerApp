"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/ui/Loader";

export default function DraftListPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/drafts`, {
          credentials: "include",
        });
        const data = await res.json();
        setDrafts(data.drafts || []);
      } catch (err) {
        console.error("LOAD DRAFTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = drafts.filter(
    (d) =>
      d.draftType?.toLowerCase().includes(search.toLowerCase()) ||
      (d.content || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader text="Loading drafts..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="sticky top-14 md:top-0 z-30 bg-[#F9FAFB] pt-2 pb-4 -mx-4 md:-mx-6 px-4 md:px-6" style={{ WebkitBackdropFilter: "blur(4px)" }}>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl md:text-2xl font-bold font-serif text-[#0B1C39]">Drafts</h1>
          <Link href="/dashboard/drafts/create" className="bg-[#0B1C39] text-white px-4 py-2 rounded-md text-sm border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]">
            + New Draft
          </Link>
        </div>

        <div className="mb-2">
          <input
            type="text"
            placeholder="Search by type or text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl bg-white text-[#0B1C39] focus:ring-2 focus:ring-[#D4A017] focus:border-[#0B1C39] outline-none"
          />
        </div>
        </div>

      {/* spacer so first draft card isn't hidden under the sticky header */}
      <div className="h-16" aria-hidden="true" />

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {filtered.length === 0 ? (
          <div className="text-gray-600 p-4 bg-white rounded shadow">No drafts found.</div>
        ) : (
          filtered.map((d) => (
            <Link
              key={d._id}
              href={`/dashboard/drafts/${d._id}`}
              className="block bg-white rounded-xl shadow-lg border-l-4 border-[#D4A017] p-4 md:hover:shadow-2xl transform md:hover:-translate-y-1 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-[#0B1C39]">{d.draftType || "Draft"}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(d.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right text-xs text-[#0B1C39] font-medium">Case: {d.caseId?.caseNumber?.toUpperCase() || "—"}</div>

              </div>

              <p className="text-sm text-gray-700 line-clamp-3">{d.content || "No content"}</p>
            </Link>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F4F6F8] text-left text-sm">
            <tr className="text-[#0B1C39]">
              <th className="p-3">Type</th>
              <th className="p-3">Case</th>
              <th className="p-3">Excerpt</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-600">No drafts found.</td>
              </tr>
            )}

            {filtered.map((d) => (
              <tr key={d._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium text-[#0B1C39]">{d.draftType || "Draft"}</td>
                <td className="p-3">{d.caseId?.caseNumber.toUpperCase() || "—"}</td>

                <td className="p-3 text-sm line-clamp-2">{d.content ? d.content.slice(0, 120) + (d.content.length>120?"...":"") : "—"}</td>
                <td className="p-3 text-sm text-gray-600">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/drafts/${d._id}`} className="text-[#0B1C39] font-medium transition-all duration-200 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] px-3 py-1">View</Link>
                    <a href={`${process.env.NEXT_PUBLIC_API}/drafts/${d._id}/pdf`} className="text-[#0B1C39] transition-all duration-200 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] px-3 py-1">PDF</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-6 text-xs text-gray-500">
        Uploaded file reference: <code className="break-all">{"/mnt/data/2025-11-21T19-38-12.471Z.png"}</code>
      </div> */}
    </div>
  );
}
