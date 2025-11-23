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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
