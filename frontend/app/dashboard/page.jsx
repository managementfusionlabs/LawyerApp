"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeCases: 0,
    solvedCases: 0,
    upcomingHearings: 0,
  });

useEffect(() => {
  const loadStats = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/cases/stats`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setStats({
          activeCases: data.activeCases,
          solvedCases: data.solvedCases,
          upcomingHearings: data.upcomingHearings,
        });
      } else {
        console.log("Stats error:", data.error);
      }
    } catch (err) {
      console.log("Dashboard stats err:", err);
    }
  };

  loadStats();
}, []);


  return (
    <div className="w-full">
      {/* Page Heading */}
      <h1 className="text-2xl font-semibold font-serif mb-4 text-[#0B1C39]">Dashboard</h1>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Active Cases */}
        <Link
          href="/dashboard/cases"
          className="p-5 bg-white rounded-xl shadow-lg border-l-4 border-[#D4A017] flex flex-col md:hover:shadow-2xl transition transform md:hover:-translate-y-1"
        >
          <span className="text-gray-600 text-sm">Active Cases</span>
          <span className="text-3xl font-bold mt-2 text-[#0B1C39]">{stats.activeCases}</span>
        </Link>

        {/* Solved Cases */}
        <Link
          href="/dashboard/cases?status=solved"
          className="p-5 bg-white rounded-xl shadow-lg border-l-4 border-[#D4A017] flex flex-col md:hover:shadow-2xl transition transform md:hover:-translate-y-1"
        >
          <span className="text-gray-600 text-sm">Solved Cases</span>
          <span className="text-3xl font-bold mt-2 text-[#0B1C39]">{stats.solvedCases}</span>
        </Link>

        {/* Hearings */}
        <Link
          href="/dashboard/hearings"
          className="p-5 bg-white rounded-xl shadow-lg border-l-4 border-[#D4A017] flex flex-col md:hover:shadow-2xl transition transform md:hover:-translate-y-1"
        >
          <span className="text-gray-600 text-sm">Upcoming Hearings</span>
          <span className="text-3xl font-bold mt-2 text-[#0B1C39]">{stats.upcomingHearings}</span>
        </Link>

      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3 text-[#0B1C39]">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Link
            href="/dashboard/cases/create"
            className="p-4 bg-[#0B1C39] rounded-xl text-white font-medium flex items-center justify-center border-2 border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]"
          >
            ➕ Create New Case
          </Link>

          <Link
            href="/dashboard/drafts"
            className="p-4 bg-white border rounded-xl flex items-center justify-center border-[#D4A017] transition-all duration-200 transform-gpu hover:scale-105 hover:rounded-2xl hover:bg-[#D4A017] hover:text-[#0B1C39]"
          >
            📝 AI Drafts
          </Link>

        </div>
      </div>
    </div>
  );
}
