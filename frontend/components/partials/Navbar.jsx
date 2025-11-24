"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // ignore errors, still navigate away
      console.error(err);
    }
    // go to landing page
    router.push("/");
  };

  return (
    <>
      <header className="w-full bg-white/40 backdrop-blur-sm sticky top-0 z-40 border-b border-white/10 px-4 py-3 relative flex items-center md:px-6">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none text-lg md:text-xl font-semibold font-serif text-[#0B1C39]">Dashboard</h1>

        <div className="ml-0 flex-1" />

        <button
          onClick={() => setConfirmOpen(true)}
          aria-label="Logout"
          className="px-3 py-1.5 bg-[#0B1C39] text-white text-sm rounded-xl md:text-base border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] shadow-sm hover:shadow-lg ease-out focus:outline-none"
        >
          Logout
        </button>
      </header>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmOpen(false)} />

          <div role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title" className="relative bg-white rounded-2xl shadow-2xl p-4 w-full max-w-[18rem] text-center pointer-events-auto">
            <h3 id="logout-confirm-title" className="text-sm font-semibold text-[#0B1C39] mb-3">Are you sure you want to log out?</h3>

            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-[#0B1C39] text-white font-semibold border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg"
              >
                Yes
              </button>

              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-white text-[#0B1C39] font-semibold border border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
