"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    // show loading spinner in the modal
    setLoadingLogout(true);

    const logoutUrl = (process.env.NEXT_PUBLIC_API || "") + "/auth/logout";

    // Attempt to send logout request in a way that is likely to be delivered
    try {
      // If same-origin or relative path, prefer sendBeacon (works during navigation)
      if (typeof window !== "undefined") {
        const isSameOrigin = logoutUrl.startsWith("/") || logoutUrl.startsWith(window.location.origin);

        if (isSameOrigin && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          try {
            const blob = new Blob([""], { type: "text/plain" });
            navigator.sendBeacon(logoutUrl, blob);
          } catch (e) {
            // fallback to fetch with keepalive
            try {
              fetch(logoutUrl, { method: "POST", credentials: "include", keepalive: true }).catch(() => {});
            } catch (fe) {}
          }
        } else {
          // cross-origin or no sendBeacon: use fetch with keepalive if available
          try {
            fetch(logoutUrl, { method: "POST", credentials: "include", keepalive: true }).catch(() => {});
          } catch (fe) {
            // final fallback
            fetch(logoutUrl, { method: "POST", credentials: "include" }).catch(() => {});
          }
        }
      }
    } catch (bgErr) {
      console.error("Background logout request failed:", bgErr);
    }

    // Clear client-side state quickly
    try {
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
        } catch (e) {}
        try {
          sessionStorage.clear();
        } catch (e) {}

        try {
          document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
            if (!name) return;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          });
        } catch (e) {
          // ignore cookie cleanup errors
        }
      }
    } catch (cleanupErr) {
      console.error("Error during optimistic logout cleanup:", cleanupErr);
    }

    // Small delay to ensure background request is scheduled, then navigate
    setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        } else {
          router.replace("/");
        }
      } catch (navErr) {
        try {
          router.replace("/");
        } catch (e) {}
      }
    }, 200);
  };


  return (
    <>
      <header className="w-full bg-white/40 backdrop-blur-sm fixed md:sticky top-0 z-40 border-b border-white/10 px-4 md:px-6 h-14 flex items-center">
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
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              if (!loadingLogout) setConfirmOpen(false);
            }}
          />

          <div role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title" className="relative bg-white rounded-2xl shadow-2xl p-4 w-full max-w-[18rem] text-center pointer-events-auto">
            <h3 id="logout-confirm-title" className="text-sm font-semibold text-[#0B1C39] mb-3">Are you sure you want to log out?</h3>

            <div className="flex gap-3 justify-center mt-2">
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="px-4 py-2 rounded-xl bg-[#0B1C39] text-white font-semibold border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-lg disabled:opacity-70 disabled:cursor-wait"
              >
                {loadingLogout ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Logging out...</span>
                  </span>
                ) : (
                  "Yes"
                )}
              </button>

              <button
                onClick={() => {
                  if (!loadingLogout) setConfirmOpen(false);
                }}
                disabled={loadingLogout}
                className="px-4 py-2 rounded-xl bg-white text-[#0B1C39] font-semibold border border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39] hover:shadow-sm disabled:opacity-60 disabled:cursor-wait"
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
