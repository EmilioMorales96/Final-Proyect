const API_URL = import.meta.env.VITE_API_URL;

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/user/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}