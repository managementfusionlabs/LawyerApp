export async function fetchMe() {
  try {
    // Use NEXT_PUBLIC_API when provided, otherwise fall back to a relative path.
    // This avoids throwing when the env var is missing in dev or in client builds
    // and prevents an uncaught "Failed to fetch" from bubbling up.
    const base = process.env.NEXT_PUBLIC_API ?? "";
    const url = base ? `${base.replace(/\/$/, "")}/auth/me` : `/auth/me`;

    const res = await fetch(url, {
      credentials: "include",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.user ?? null;
  } catch (err) {
    // Log the error for diagnostics but don't throw so callers can handle a null user.
    // Common causes: network down, CORS, invalid NEXT_PUBLIC_API value, or dev proxy issues.
    // eslint-disable-next-line no-console
    console.error("fetchMe failed:", err);
    return null;
  }
}
