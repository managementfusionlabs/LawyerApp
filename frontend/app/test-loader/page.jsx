"use client";

import Loader from "@/components/ui/Loader"; // update path if needed

export default function TestLoaderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Loader Preview</h1>

      <div className="flex flex-col items-center gap-6">

        {/* Default */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">Default (5rem)</p>
          <Loader />
        </div>

        {/* Small */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">Small (3rem)</p>
          <Loader size={3} />
        </div>

        {/* Large */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">Large (7rem)</p>
          <Loader size={7} />
        </div>

      </div>
    </div>
  );
}
