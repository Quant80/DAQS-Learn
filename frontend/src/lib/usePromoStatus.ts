"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

interface PromoStatus {
  granted: number;
  cap: number;
  remaining: number;
}

/** Public "first 100 sign-ups" counter — no auth needed, safe to show anyone. */
export function usePromoStatus() {
  const [status, setStatus] = useState<PromoStatus | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/promo/python-status`)
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  return status;
}
