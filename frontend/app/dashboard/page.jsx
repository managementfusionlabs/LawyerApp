"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 1. Custom Icon Set for a cleaner look (No external libraries needed)
const DashboardIcons = {
  Briefcase: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  Gavel: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  Calendar: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
  )
};

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

  // Reusable Stats Card Component
  const StatsCard = ({ title, count, icon: Icon, href, delay }) => (
    <Link
      href={href}
      className={`group relative overflow-hidden bg-white p-6 rounded-xl border border-[#D4A017]/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Hover Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4A017]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-between z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 group-hover:text-[#D4A017] transition-colors">
            {title}
          </p>
          <p className="text-4xl font-serif font-semibold text-[#0B1C39]">
            {count}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#F8F8F8] border border-[#D4A017]/20 flex items-center justify-center text-[#0B1C39] group-hover:bg-[#0B1C39] group-hover:text-[#D4A017] transition-colors duration-300 shadow-inner">
          <Icon />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-[#D4A017]/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1C39] mb-1">Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back to your legal dashboard.</p>
        </div>
        <div className="hidden md:block text-sm text-[#D4A017] font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 1. Stats Row - Aligned horizontally on tablets+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Cases" 
          count={stats.activeCases} 
          icon={DashboardIcons.Briefcase} 
          href="/dashboard/cases" 
        />
        <StatsCard 
          title="Solved Cases" 
          count={stats.solvedCases} 
          icon={DashboardIcons.Gavel} 
          href="/dashboard/cases?status=solved" 
        />
        <StatsCard 
          title="Hearings" 
          count={stats.upcomingHearings} 
          icon={DashboardIcons.Calendar} 
          href="/dashboard/hearings" 
        />
      </div>

      {/* 2. Quick Actions Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#0B1C39] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4A017]"></span>
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Create New Case - Primary Action */}
          <Link
            href="/dashboard/cases/create"
            className="group relative flex items-center justify-between p-6 bg-[#0B1C39] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Background Texture */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4A017] opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:opacity-20 transition-opacity"></div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#D4A017] text-[#0B1C39] flex items-center justify-center shadow-lg">
                <DashboardIcons.Plus />
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-lg">Create New Case</h3>
                <p className="text-[#D4A017]/80 text-sm">Start a new legal filing</p>
              </div>
            </div>
            
            <div className="text-[#D4A017] opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <DashboardIcons.ArrowRight />
            </div>
          </Link>

          {/* AI Drafts - Secondary Action */}
          <Link
            href="/dashboard/drafts"
            className="group relative flex items-center justify-between p-6 bg-white border border-[#D4A017]/30 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[#D4A017] hover:-translate-y-1"
          >
             <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FDF8E8] text-[#D4A017] border border-[#D4A017]/20 flex items-center justify-center">
                <DashboardIcons.Sparkles />
              </div>
              <div className="text-left">
                <h3 className="text-[#0B1C39] font-bold text-lg">AI Drafts</h3>
                <p className="text-gray-500 text-sm group-hover:text-[#D4A017] transition-colors">Generate legal documents</p>
              </div>
            </div>

            <div className="text-[#0B1C39] opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <DashboardIcons.ArrowRight />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}