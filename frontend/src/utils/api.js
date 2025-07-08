const BASE_URL = import.meta.env.VITE_API_URL || "";

// Helper to build full URL
function buildUrl(path) {
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

// Helper to get auth token from localStorage (adapt if you use context/cookies)
function getToken() {
  return localStorage.getItem("token");
}

// Default headers for JSON requests
function getHeaders(isJson = true) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
}

// Handle API response and errors
async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    const error = data?.message || res.statusText || "API Error";
    throw new Error(error);
  }
  return data;
}

const api = {
  // GET request
  async get(path) {
    const res = await fetch(buildUrl(path), {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // POST request (JSON)
  async post(path, body = {}) {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // PUT request (JSON)
  async put(path, body = {}) {
    const res = await fetch(buildUrl(path), {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // PATCH request (JSON)
  async patch(path, body = {}) {
    const res = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // DELETE request
  async delete(path) {
    const res = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // POST/PUT with FormData (for file uploads)
  async upload(path, formData, method = "POST") {
    const headers = getHeaders(false); // Don't set Content-Type for FormData
    const res = await fetch(buildUrl(path), {
      method,
      headers,
      credentials: "include",
      body: formData,
    });
    return handleResponse(res);
  },
};

export default api;