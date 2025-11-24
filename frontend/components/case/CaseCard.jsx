import Link from "next/link";
import Card from "@/components/ui/Card";

export default function CaseCard({ caseData }) {
  return (
    <Card className="p-5 border-l-4 border-[#D4A017] hover:shadow-2xl transition">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0B1C39]">
          {caseData.clientName}
        </h3>

        <span
          className={`px-3 py-1 rounded text-sm ${
            caseData.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {caseData.status}
        </span>
      </div>

      <p className="text-gray-600 mt-1">
        Case Type: {caseData.caseType}
      </p>

      <p className="text-gray-600">
        Case No: {caseData.caseNumber}
      </p>

      <p className="text-gray-600">
        Court: {caseData.courtName}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Filed On: {caseData.filingDate}
      </p>

      <div className="mt-4 flex gap-3">
        <Link
          href={`/dashboard/cases/${caseData._id}`}
          className="bg-[#0B1C39] text-white px-3 py-1 rounded text-sm border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]"
        >
          View
        </Link>

        <Link
          href={`/dashboard/cases/edit/${caseData._id}`}
          className="bg-white text-[#0B1C39] px-3 py-1 rounded text-sm border border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]"
        >
          Edit
        </Link>
      </div>
    </Card>
  );
}
