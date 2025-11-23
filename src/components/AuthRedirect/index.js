"use client";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Routes that don't require authentication
const publicRoutes = ["/login", "/admin/login"];

// Admin routes
const adminRoutes = ["/admin"];

export default function AuthRedirect({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = Cookies.get("token");
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = pathname.startsWith("/admin");

    // Handle admin routes
    if (isAdminRoute) {
      if (!pathname.startsWith("/admin/login") && !token) {
        router.replace("/admin/login");
      } else if (pathname === "/admin/login" && token) {
        router.replace("/admin/dashboard");
      }
      return;
    }

    // Handle root path
    if (pathname === "/") {
      router.replace(token ? "/dashboard" : "/login");
      return;
    }

    // Handle protected routes
    if (!isPublicRoute && !token) {
      router.replace("/login");
      return;
    }

    // If on login page but already authenticated
    if (pathname.startsWith("/login") && token) {
      router.replace("/dashboard");
      return;
    }
  }, [isClient, pathname, router]);

  return isClient ? children : null;
}