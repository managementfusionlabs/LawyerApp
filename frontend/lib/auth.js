export async function fetchMe() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.user;
}
