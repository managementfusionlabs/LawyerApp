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
    <div className="p-4 md:p-6">
      
      <h1 className="text-2xl font-semibold font-serif text-[#0B1C39] mb-4">
        Your Profile
      </h1>

      <Button
        variant="primary"
        onClick={() => router.push("/dashboard/profile/edit")}
        className="mb-6"
      >
        Edit Profile
      </Button>

      {/* ⭐ FULL WIDTH CARD WITHOUT EXTRA WRAPPERS ⭐ */}
      <ProfileCard user={user} />
    </div>
  );
}
