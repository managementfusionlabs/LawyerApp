import React from "react";

export default function CasePage({ params }) {
	const { id } = params || {};

	return (
		<div className="p-6">
			<div className="bg-white rounded-2xl p-6 shadow border-l-4 border-[#D4A017]">
				<h1 className="text-2xl font-bold font-serif text-[#0B1C39] mb-2">Case Details</h1>
				<p className="text-sm text-gray-600 mb-4">Showing details for case id: <span className="font-medium">{id}</span></p>
				<p className="text-gray-700">This page is a placeholder. Replace with the real case detail component when ready.</p>
			</div>
		</div>
	);
}
