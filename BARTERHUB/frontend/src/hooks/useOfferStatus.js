// src/hooks/useOfferStatus.js
import { useState } from "react";

export const useOfferStatus = (offerId, navigate) => {
  const [loading, setLoading] = useState(false);

  const patchOfferStatus = async (status, successMsg) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${import.meta.env.VITE_OFFERS_API}${offerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error(`Failed to ${status} offer`);

      const patchResponse = await res.json();
      console.log("📦 PATCH response:", patchResponse);

      const verifyRes = await fetch(`${import.meta.env.VITE_OFFERS_API}${offerId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedOffer = await verifyRes.json();
      console.log("🔄 Updated offer from backend:", updatedOffer);

      alert(successMsg);
      navigate(-1);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, patchOfferStatus };
};
