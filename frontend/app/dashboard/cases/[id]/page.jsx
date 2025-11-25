"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe } from "@/lib/auth";

export default function CasePage({ params }) {
	const id = params?.id ?? "";
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [caseData, setCaseData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;

		(async () => {
			try {
				setLoading(true);

				// get current user (lawyer) to include id in the request
				const user = await fetchMe();
				if (!user) {
					// not authenticated - redirect to login
					router.push("/auth/login");
					return;
				}

				const base = process.env.NEXT_PUBLIC_API ?? "";
				const baseUrl = base ? base.replace(/\/$/, "") : "";
				const url = baseUrl
					? `${baseUrl}/cases/${id}?lawyer=${encodeURIComponent(user._id)}`
					: `/cases/${id}?lawyer=${encodeURIComponent(user._id)}`;

				const res = await fetch(url, { credentials: "include" });
				if (!res.ok) {
					setError(`Failed to load case (${res.status})`);
					setLoading(false);
					return;
				}

				const json = await res.json();
				if (!mounted) return;
				setCaseData(json.case || json.data || json);
			} catch (err) {
				console.error("Error loading case detail:", err);
				setError("Network error while loading case");
			} finally {
				if (mounted) setLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [id, router]);

	if (loading) return <div className="p-6">Loading case...</div>;
	if (error)
		return (
			<div className="p-6">
				<div className="bg-white rounded-2xl p-6 shadow border-l-4 border-red-500">
					<h1 className="text-xl font-bold text-[#0B1C39]">Error</h1>
					<p className="text-sm text-red-600">{error}</p>
				</div>
			</div>
		);

	if (!caseData)
		return (
			<div className="p-6">
				<div className="bg-white rounded-2xl p-6 shadow border-l-4 border-[#D4A017]">
					<h1 className="text-2xl font-bold font-serif text-[#0B1C39] mb-2">Case Not Found</h1>
					<p className="text-sm text-gray-600">No case found for id: <span className="font-medium">{id}</span></p>
				</div>
			</div>
		);

	return (
		<div className="p-6">
			<div className="bg-white rounded-2xl p-6 shadow border-l-4 border-[#D4A017]">
				<h1 className="text-2xl font-bold font-serif text-[#0B1C39] mb-2">Case Details</h1>

				<p className="text-sm text-gray-600 mb-4">Case ID: <span className="font-medium">{id}</span></p>

				<div className="space-y-2 text-gray-700">
					<div><strong>Client:</strong> {caseData.clientName ?? caseData.client}</div>
					<div><strong>Case Number:</strong> {caseData.caseNumber ?? caseData.number}</div>
					<div><strong>Court:</strong> {caseData.courtName ?? caseData.court}</div>
					<div><strong>Type:</strong> {caseData.caseType ?? caseData.type}</div>
					<div><strong>Status:</strong> {caseData.status}</div>
					<div><strong>Filed On:</strong> {caseData.filingDate}</div>
				</div>
			</div>
		</div>
	);
}
