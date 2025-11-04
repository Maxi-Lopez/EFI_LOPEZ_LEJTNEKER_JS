export const API_URL = "http://localhost:5000/api";

const api = {
  async get(path, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${path}`, { headers });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async post(path, data, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async put(path, data, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async delete(path, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
}

};

export default api;
