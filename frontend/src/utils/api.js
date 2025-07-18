export default api;
const BASE_URL = import.meta.env.VITE_API_URL;

// Helper to build full URL
function buildUrl(path) {
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}


// Default headers for JSON requests
function getHeaders(isJson = true) {
  const headers = {};
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
  get: async function(path) {
    const res = await fetch(buildUrl(path), {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // POST request (JSON)
  post: async function(path, body = {}) {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // PUT request (JSON)
  put: async function(path, body = {}) {
    const res = await fetch(buildUrl(path), {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // PATCH request (JSON)
  patch: async function(path, body = {}) {
    const res = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // DELETE request
  delete: async function(path) {
    const res = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Logout request
  logout: async function() {
    const res = await fetch(buildUrl('/api/auth/logout'), {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(res);
  },

  // POST/PUT with FormData (for file uploads)
  upload: async function(path, formData, method = "POST") {
    const headers = getHeaders(false); // Don't set Content-Type for FormData
    const res = await fetch(buildUrl(path), {
      method,
      headers,
      credentials: "include",
      body: formData,
    });
    return handleResponse(res);
  }
};