import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useUserProfile() {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoadingUser(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch(import.meta.env.VITE_PROFILE_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setLoadingUser(false);
      }
    }
    fetchProfile();
  }, [navigate]);

  return { userData, loadingUser, setUserData };
}
