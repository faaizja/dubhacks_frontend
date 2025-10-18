"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlertContext } from "../../context/alertContext";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout({ children }) {
  const redirecting = useRef(false);
  const { showAlert } = useContext(AlertContext);
  const { user, logout, loading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const redirectToLogin = (msg) => {
    const params = new URLSearchParams();
    if (msg) params.set("msg", msg);
    params.set("from", pathname); // save current page
    router.push(`/login?${params.toString()}`);
  };

  useEffect(() => {
    if (loading) return;

    const accessToken = user?.accessToken;

    if (!accessToken && !redirecting.current) {
      redirecting.current = true;
      redirectToLogin("Please log in to continue");
      return;
    }

    const refreshAccessToken = async (refreshToken) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: refreshToken }),
          }
        );

        if (!res.ok) throw new Error("Failed to refresh token");

        const data = await res.json();
        const newAccessToken = data.accessToken;

        setUser((prev) => ({
          ...prev,
          accessToken: newAccessToken,
        }));

        return newAccessToken;
      } catch (err) {
        logout(); // cannot refresh → force logout
        return null;
      }
    };

    if (accessToken && !redirecting.current) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const now = Date.now() / 1000;

        if (payload.exp && payload.exp < now) {
          // Token expired — try to refresh
          refreshAccessToken(user.refreshToken)
            .then((newToken) => {
              if (!newToken) {
                redirecting.current = true;
                logout();
                redirectToLogin("Session expired. Please log in again.");
              }
            })
            .catch(() => {
              redirecting.current = true;
              logout();
              redirectToLogin("Session expired. Please log in again.");
            });
        }
      } catch (err) {
        console.error("Invalid token", err);
        redirecting.current = true;
        logout();
        redirectToLogin();
      }
    }
  }, [user, loading, router, logout]);

  // Sidebar localStorage logic
  useEffect(() => {
    const storedSidebar = localStorage.getItem("sidebarOpen");
    if (storedSidebar !== null) setSidebarOpen(storedSidebar === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString());
  }, [sidebarOpen]);

  if (loading) return <div>Loading...</div>;
  if (!user?.accessToken) return null;

  return (
    <div className="">
      <main
        className={`min-h-screen w-screen`}
      >
        <div>{children}</div>
      </main>
    </div>
  );
}
