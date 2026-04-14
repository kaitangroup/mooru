const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '');

export const wpFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('wpToken');

  const res = await fetch(`${WP_API}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'API error');
  }

  return data;
};