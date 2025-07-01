export const fetchWithTokenRefresh = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const makeRequest = async (token) => {
    return await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // auto add token here
        ...(options.headers || {}), // allow overriding headers if needed
      },
    });
  };

  try {
    let res = await makeRequest(accessToken);

    if (res.status === 401 && refreshToken) {
      // Try to refresh token
      const refreshRes = await fetch(import.meta.env.VITE_REFRESH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshRes.ok) {
        // Clear tokens if refresh failed
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        throw new Error("Session expired. Please log in again.");
      }

      const refreshData = await refreshRes.json();
      accessToken = refreshData.access;
      localStorage.setItem("access_token", accessToken);

      // Save new refresh token if the backend rotates it
      if (refreshData.refresh) {
        localStorage.setItem("refresh_token", refreshData.refresh);
      }

      // Retry original request
      res = await makeRequest(accessToken);
    }

    return res;
  } catch (error) {
    throw new Error(error.message || "Network error occurred");
  }
};
