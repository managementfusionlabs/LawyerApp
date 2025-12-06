"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe } from "@/lib/auth.js";
import Loader from "@/components/ui/Loader";
import ProfileCard from "@/components/ui/ProfileCard";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader size={4} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        Could not load profile.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold font-serif text-[#0B1C39]">
        Your Profile
      </h1>

      <Button
        variant="primary"
        onClick={() => router.push("/dashboard/profile/edit")}
      >
        Edit Profile
      </Button>

      <div className="border-l-4 border-[#D4A017] rounded-xl shadow bg-white p-6">
        <ProfileCard user={user} />
      </div>
    </div>
  );
}
