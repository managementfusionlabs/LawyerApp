"use client";

import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/auth"; 
import Loader from "@/components/ui/Loader"; 

// Custom Premium Icons (No external deps)
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  Building: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
  Bell: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>,
};

// Reusable Toggle Switch Component
const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-gray-700 text-sm font-medium">{label}</span>
    <button onClick={() => onChange(!checked)} className="focus:outline-none group">
      <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out transition-colors ${checked ? 'bg-[#0B1C39]' : 'bg-gray-300'}`}>
        <div className={`bg-[#D4A017] w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0 group-hover:translate-x-0.5'}`}></div>
      </div>
    </button>
  </div>
);

// Reusable Premium Input Component
const PremiumInput = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 rounded-lg border border-gray-200 bg-[#F8F8F8] text-[#0B1C39] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4A017] focus:border-[#D4A017] transition-all focus:bg-white focus:shadow-sm"
    />
  </div>
);

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form States (Dummy interactive states)
  const [formData, setFormData] = useState({
    chamberName: "",
    barId: "",
    hourlyRate: "",
    signature: "",
    emailUpdates: true,
    marketingEmails: false,
    twoFactor: false,
    smsAlerts: true
  });

  useEffect(() => {
    fetchMe().then((u) => {
      setUser(u);
      setFormData(prev => ({ 
        ...prev, 
        chamberName: u?.chamberName || "Legal Associates LLP", 
        signature: u?.signature || "" 
      }));
      setLoading(false);
    });
  }, []);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      setSaving(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={4} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D4A017]/20 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B1C39]">Account Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your profile, preferences, and security.</p>
        </div>
        
        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-[#D4A017] text-[#0B1C39] px-6 py-2.5 rounded-xl font-bold hover:bg-[#b88a10] transition-all hover:-translate-y-0.5 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? (
             <span className="w-5 h-5 border-2 border-[#0B1C39] border-t-transparent rounded-full animate-spin"></span>
          ) : (
             <Icons.Save />
          )}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Profile Summary) --- */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#D4A017]/20 shadow-sm text-center relative overflow-hidden group">
             {/* Gradient Banner */}
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#0B1C39] to-[#1e3a6e]"></div>
             
             <div className="relative z-10 -mt-2">
                <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
                   <img 
                      src={user?.profileImage || "/default-avatar.png"} 
                      onError={(e) => {
                        if (e.target.src !== window.location.origin + "/default-avatar.png") {
                           e.target.src = "/default-avatar.png";
                        }
                      }}
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full bg-gray-100"
                   />
                </div>
                <h2 className="mt-3 text-xl font-bold text-[#0B1C39] font-serif">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                
                {/* Role Badge */}
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-[#D4A017]/10 text-[#D4A017] text-xs font-bold uppercase tracking-widest border border-[#D4A017]/20">
                  {user?.role || "Attorney"}
                </div>
             </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#F8F8F8] rounded-xl p-5 border border-gray-200">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account ID</h3>
             <p className="font-mono text-xs text-[#0B1C39] break-all bg-white p-2 rounded border border-gray-200 select-all">
               {user?._id}
             </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Forms) --- */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. PROFESSIONAL DETAILS CARD */}
          <section className="bg-white rounded-2xl border border-[#D4A017]/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="text-[#D4A017]"><Icons.Building /></span>
              <h3 className="font-serif font-bold text-[#0B1C39]">Professional Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumInput 
                label="Chamber / Office Name" 
                placeholder="e.g. Legal Associates LLP"
                value={formData.chamberName}
                onChange={(e) => setFormData({...formData, chamberName: e.target.value})}
              />
              <PremiumInput 
                label="Bar Association ID" 
                placeholder="e.g. BA-12345-NY"
                value={formData.barId}
                onChange={(e) => setFormData({...formData, barId: e.target.value})}
              />
              <PremiumInput 
                label="Hourly Consultation Rate ($)" 
                placeholder="0.00"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              />
              
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Document Signature / Footer</label>
                <textarea
                  rows={3}
                  className="w-full p-3 rounded-lg border border-gray-200 bg-[#F8F8F8] text-[#0B1C39] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4A017] focus:border-[#D4A017] transition-all resize-none focus:bg-white focus:shadow-sm"
                  placeholder="Sincerely, [Name]..."
                  value={formData.signature}
                  onChange={(e) => setFormData({...formData, signature: e.target.value})}
                />
                <p className="text-xs text-gray-400">This text will be appended to your AI-generated legal drafts.</p>
              </div>
            </div>
          </section>

          {/* 2. NOTIFICATIONS CARD */}
          <section className="bg-white rounded-2xl border border-[#D4A017]/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="text-[#D4A017]"><Icons.Bell /></span>
              <h3 className="font-serif font-bold text-[#0B1C39]">Notifications</h3>
            </div>
            <div className="p-6">
              <Toggle 
                label="Email Updates on Case Changes" 
                checked={formData.emailUpdates} 
                onChange={(v) => setFormData({...formData, emailUpdates: v})}
              />
              <Toggle 
                label="SMS Alerts for Hearings" 
                checked={formData.smsAlerts} 
                onChange={(v) => setFormData({...formData, smsAlerts: v})}
              />
               <Toggle 
                label="Marketing & Newsletter" 
                checked={formData.marketingEmails} 
                onChange={(v) => setFormData({...formData, marketingEmails: v})}
              />
            </div>
          </section>

           {/* 3. SECURITY CARD */}
           <section className="bg-white rounded-2xl border border-[#D4A017]/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="text-[#D4A017]"><Icons.Lock /></span>
              <h3 className="font-serif font-bold text-[#0B1C39]">Security</h3>
            </div>
            <div className="p-6 space-y-4">
               <Toggle 
                label="Two-Factor Authentication (2FA)" 
                checked={formData.twoFactor} 
                onChange={(v) => setFormData({...formData, twoFactor: v})}
              />
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">Last password change: 3 months ago</span>
                <button className="text-sm font-bold text-[#D4A017] hover:text-[#b88a10] hover:underline transition-all">
                  Change Password
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}