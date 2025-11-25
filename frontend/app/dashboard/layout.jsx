"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/partials/Sidebar";
import Navbar from "@/components/partials/Navbar";
import { fetchMe } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await fetchMe();
      setLoading(false);
      if (!user) router.push("/auth/login");
    })();
  }, []);

  if (loading) return <div className="p-6">Checking authentication...</div>;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] bg-[radial-gradient(ellipse_at_center,rgba(10,26,47,0.04),rgba(10,26,47,0))]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 pt-14 md:pt-6 flex-1 overflow-auto" style={{ WebkitOverflowScrolling: "touch" }}>{children}</main>
      </div>
    </div>
  );
}
