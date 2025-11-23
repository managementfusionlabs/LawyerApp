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
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Active Cases */}
        <Link
          href="/dashboard/cases"
          className="p-5 bg-white rounded-xl shadow border flex flex-col hover:shadow-md transition"
        >
          <span className="text-gray-600 text-sm">Active Cases</span>
          <span className="text-3xl font-bold mt-2">{stats.activeCases}</span>
        </Link>

        {/* Solved Cases */}
        <Link
          href="/dashboard/cases?status=solved"
          className="p-5 bg-white rounded-xl shadow border flex flex-col hover:shadow-md transition"
        >
          <span className="text-gray-600 text-sm">Solved Cases</span>
          <span className="text-3xl font-bold mt-2">{stats.solvedCases}</span>
        </Link>

        {/* Hearings */}
        <Link
          href="/dashboard/hearings"
          className="p-5 bg-white rounded-xl shadow border flex flex-col hover:shadow-md transition"
        >
          <span className="text-gray-600 text-sm">Upcoming Hearings</span>
          <span className="text-3xl font-bold mt-2">{stats.upcomingHearings}</span>
        </Link>

      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Link
            href="/dashboard/cases/create"
            className="p-4 bg-black rounded-xl text-white font-medium flex items-center justify-center hover:bg-gray-900 transition"
          >
            ➕ Create New Case
          </Link>

          <Link
            href="/dashboard/drafts"
            className="p-4 bg-white border rounded-xl flex items-center justify-center hover:shadow-md transition"
          >
            📝 AI Drafts
          </Link>

        </div>
      </div>
    </div>
  );
}
