"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import TextArea from "@/components/ui/TextArea";
import Modal from "@/components/ui/Modal";

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // form mirrors allowed update fields
  const [form, setForm] = useState({
    name: "",
    title: "",
    profileImage: "",
    phone: "",
    officeAddress: "",
    clientFacingName: "",
    practiceAreas: "", // comma-separated in UI -> array on save
    jurisdictions: "",
    yearsOfExperience: "",
    languages: "",
    website: "",
    shortBio: "",
    longBio: "",
    consultationFee: "",
    availabilityNotes: "",
    // admissions/education/publications/memberships we keep simple arrays as comma-separated for this UI
    admissions: "",
    education: "",
    awards: "",
    publications: "",
    memberships: "",
    social_linkedin: "",
    social_twitter: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setUser(data);
        // prefill form (transform arrays -> CSV)
        setForm({
          name: data.name || "",
          title: data.title || "",
          profileImage: data.profileImage || "",
          phone: data.phone || "",
          officeAddress: data.officeAddress || "",
          clientFacingName: data.clientFacingName || "",
          practiceAreas: (data.practiceAreas || []).join(", "),
          jurisdictions: (data.jurisdictions || []).join(", "),
          yearsOfExperience: data.yearsOfExperience || "",
          languages: (data.languages || []).join(", "),
          website: data.website || "",
          shortBio: data.shortBio || "",
          longBio: data.longBio || "",
          consultationFee: data.consultationFee || "",
          availabilityNotes: data.availabilityNotes || "",
          admissions: (data.admissions || []).map(a => `${a.jurisdiction}:${a.barNumber || ""}:${a.admittedYear || ""}`).join("; "), // simple encoding
          education: (data.education || []).map(e => `${e.school}|${e.degree}|${e.year || ""}`).join("; "),
          awards: (data.awards || []).join(", "),
          publications: (data.publications || []).map(p => `${p.title}|${p.link || ""}`).join("; "),
          memberships: (data.memberships || []).join(", "),
          social_linkedin: (data.social && data.social.linkedin) || "",
          social_twitter: (data.social && data.social.twitter) || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

const handleSave = async (e) => {
  e.preventDefault();
  setSaving(true);

  const payload = {
    name: form.name,
    title: form.title,
    profileImage: form.profileImage,
    phone: form.phone,
    officeAddress: form.officeAddress,
    clientFacingName: form.clientFacingName,
    practiceAreas: form.practiceAreas.split(",").map(s => s.trim()).filter(Boolean),
    jurisdictions: form.jurisdictions.split(",").map(s => s.trim()).filter(Boolean),
    yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : user.yearsOfExperience,
    languages: form.languages.split(",").map(s => s.trim()).filter(Boolean),
    website: form.website,
    shortBio: form.shortBio,
    longBio: form.longBio,
    consultationFee: form.consultationFee,
    availabilityNotes: form.availabilityNotes,
    awards: form.awards.split(",").map(s => s.trim()).filter(Boolean),
    memberships: form.memberships.split(",").map(s => s.trim()).filter(Boolean),
    social: {
      linkedin: form.social_linkedin,
      twitter: form.social_twitter,
    },
    admissions: form.admissions.split(";").map(s => {
      const parts = s.split(":").map(p => p.trim());
      return { jurisdiction: parts[0] || "", barNumber: parts[1] || "", admittedYear: parts[2] ? Number(parts[2]) : undefined };
    }).filter(a => a.jurisdiction),
    education: form.education.split(";").map(s => {
      const parts = s.split("|").map(p => p.trim());
      return { school: parts[0] || "", degree: parts[1] || "", year: parts[2] || "" };
    }).filter(e => e.school),
    publications: form.publications.split(";").map(s => {
      const parts = s.split("|").map(p => p.trim());
      return { title: parts[0] || "", link: parts[1] || "" };
    }).filter(p => p.title),
  };

  // 🔥 Remove empty fields so they don't overwrite user data
  Object.keys(payload).forEach((key) => {
    const value = payload[key];

    // Remove empty strings
    if (value === "" || value === null) {
      delete payload[key];
    }

    // Remove empty arrays
    if (Array.isArray(value) && value.length === 0) {
      delete payload[key];
    }

    // Remove empty nested social fields
    if (key === "social") {
      if (!payload.social.linkedin && !payload.social.twitter) {
        delete payload.social;
      }
    }
  });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update");
      setSaving(false);
      return;
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2200);

  } catch (err) {
    console.error(err);
    alert("Server error");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <div className="p-6 flex justify-center"><Loader /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold font-serif text-[#0B1C39]">Edit Profile</h1>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input value={form.name} onChange={(e)=>updateField("name", e.target.value)} placeholder="Full name" />
          <Input value={form.clientFacingName} onChange={(e)=>updateField("clientFacingName", e.target.value)} placeholder="Display name (optional)" />
          <Input value={form.title} onChange={(e)=>updateField("title", e.target.value)} placeholder="Title (e.g., Senior Associate)" />
          <Input value={form.profileImage} onChange={(e)=>updateField("profileImage", e.target.value)} placeholder="Profile Image URL" />
          <Input value={form.phone} onChange={(e)=>updateField("phone", e.target.value)} placeholder="Phone" />
          <Input value={form.officeAddress} onChange={(e)=>updateField("officeAddress", e.target.value)} placeholder="Office address" />
          <Input value={form.website} onChange={(e)=>updateField("website", e.target.value)} placeholder="Website" />
          <Input value={form.yearsOfExperience} onChange={(e)=>updateField("yearsOfExperience", e.target.value)} placeholder="Years of experience (number)" />
        </div>

        <div className="space-y-4">
          <Input value={form.practiceAreas} onChange={(e)=>updateField("practiceAreas", e.target.value)} placeholder="Practice areas (comma separated)" />
          <Input value={form.jurisdictions} onChange={(e)=>updateField("jurisdictions", e.target.value)} placeholder="Jurisdictions (comma separated)" />
          <Input value={form.languages} onChange={(e)=>updateField("languages", e.target.value)} placeholder="Languages (comma separated)" />
          <Input value={form.awards} onChange={(e)=>updateField("awards", e.target.value)} placeholder="Awards (comma separated)" />
          <Input value={form.memberships} onChange={(e)=>updateField("memberships", e.target.value)} placeholder="Memberships (comma separated)" />
          <Input value={form.consultationFee} onChange={(e)=>updateField("consultationFee", e.target.value)} placeholder="Consultation fee info" />
          <Input value={form.availabilityNotes} onChange={(e)=>updateField("availabilityNotes", e.target.value)} placeholder="Availability notes" />
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="block text-sm font-medium text-[#0B1C39]">Admissions (format: Jurisdiction:BarNumber:Year; ...)</label>
          <Input value={form.admissions} onChange={(e)=>updateField("admissions", e.target.value)} placeholder="e.g. New York:123456:2018; California:..." />

          <label className="block text-sm font-medium text-[#0B1C39]">Education (format: School|Degree|Year; ...)</label>
          <Input value={form.education} onChange={(e)=>updateField("education", e.target.value)} placeholder="e.g. Yale Law School|JD|2015; ..." />

          <label className="block text-sm font-medium text-[#0B1C39]">Publications (format: Title|Link; ...)</label>
          <Input value={form.publications} onChange={(e)=>updateField("publications", e.target.value)} placeholder="e.g. 'Article Title'|https://...; ..." />

          <label className="block text-sm font-medium text-[#0B1C39]">Short Bio</label>
          <TextArea value={form.shortBio} onChange={(e)=>updateField("shortBio", e.target.value)} rows={3} />

          <label className="block text-sm font-medium text-[#0B1C39]">Long Bio</label>
          <TextArea value={form.longBio} onChange={(e)=>updateField("longBio", e.target.value)} rows={6} />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <Button type="submit" className="flex-1" variant="primary" disabled={saving}>
            {saving ? <Loader /> : "Save Profile"}
          </Button>

          <Button type="button" variant="ghost" onClick={() => window.location.reload()}>
            Cancel
          </Button>
        </div>
      </form>

      <Modal show={showSuccess}>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Saved 🎉</h3>
          <p className="text-sm text-gray-600 mt-2">Your profile has been updated.</p>
        </div>
      </Modal>
    </div>
  );
}
