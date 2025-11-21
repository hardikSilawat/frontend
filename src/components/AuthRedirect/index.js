"use client";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Auth routes that should redirect to home if already authenticated
const authRoutes = ["/login"];

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];

export default function AuthRedirect({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = Cookies.get("UserToken");
    const adminToken = Cookies.get("AdminToken");

    // Handle admin routes
    if (pathname.startsWith("/admin")) {
      if (!adminToken) {
        if (!pathname.startsWith("/admin/login")) {
          router.replace("/admin/login");
        }
      } else if (pathname === "/admin/login") {
        router.replace("/admin/dashboard");
      }
      return;
    }

    // Handle root path
    if (pathname === "/") {
      if (adminToken) {
        router.replace("/admin/dashboard");
      } else if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
      return;
    }

    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    );

    // Handle protected routes
    if (isProtectedRoute) {
      if (adminToken) {
        router.replace("/admin/dashboard");
        return;
      }
      if (!token) {
        router.replace("/login");
        return;
      }
    }

    // Handle auth routes
    if (isAuthRoute) {
      if (adminToken) {
        router.replace("/admin/dashboard");
        return;
      }
      if (token) {
        router.replace("/dashboard");
        return;
      }
    }
  }, [isClient, pathname, router]);

  return isClient ? children : null;
}