const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function getApiOrigin() {
  return API_BASE.replace(/\/api\/?$/, "");
}

export function mediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const origin = getApiOrigin();
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}