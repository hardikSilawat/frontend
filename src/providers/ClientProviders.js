"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { toast } from "react-toastify";
import { setUser, setAdmin } from "@/redux/reducers";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/apiHandler/page";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "@/app/theme";
import GlobalToastContainer from "@/components/GlobalToast/page";
import { ConfirmProvider } from "@/contexts/ConfirmContext";

const publicRoutes = ["/login", "/admin/login"];

function AuthAndProviders({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Token Names and Cookie Handlers
  const isAdminRoute = pathname?.startsWith("/admin");
  const tokenName = isAdminRoute ? "AdminToken" : "UserToken";

  /** Redirect logic for all routes and roles */
  const handleRouting = useCallback(
    (token) => {
      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Admin routes
      if (isAdminRoute) {
        if (!pathname.startsWith("/admin/login") && !token) {
          router.replace("/admin/login");
          return;
        }
        if (pathname === "/admin/login" && token) {
          router.replace("/admin/dashboard");
          return;
        }
      }

      // Root
      if (pathname === "/") {
        router.replace(token ? "/dashboard" : "/login");
        return;
      }

      // Protected route, not logged in
      if (!isPublicRoute && !token) {
        router.replace("/login");
        return;
      }

      // On login page but already logged in
      if (pathname.startsWith("/login") && token) {
        router.replace("/dashboard");
        return;
      }
    },
    [pathname, router, isAdminRoute]
  );

  /** Remove all tokens and reset Redux, then redirect */
  const handleInvalidToken = useCallback(() => {
    Cookies.remove("UserToken", { path: "/" });
    Cookies.remove("AdminToken", { path: "/" });
    dispatch(setUser(null));
    dispatch(setAdmin(null));
    handleRouting(false);
    toast.error("Your session has expired. Please log in again.");
  }, [dispatch, handleRouting]);

  /** Check token and refresh Redux/user session state */
  const checkToken = useCallback(async () => {
    const token = Cookies.get(tokenName);
    if (!token) {
      dispatch(setUser(null));
      dispatch(setAdmin(null));
      handleRouting(false);
      return;
    }
    try {
      const response = await api.get(`/auth/me`);
      if (response?.success) {
        // Refresh token
        Cookies.set(tokenName, token, {
          expires: 100 * 365,
          path: "/",
          secure: false,
          sameSite: "strict",
        });
        // Set Redux state
        if (isAdminRoute) {
          dispatch(setAdmin(response.data));
        } else {
          dispatch(setUser(response.data));
        }
        handleRouting(token);
      } else {
        handleInvalidToken();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      handleInvalidToken();
    }
  }, [dispatch, tokenName, isAdminRoute, handleInvalidToken, handleRouting]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!isMounted.current) {
      isMounted.current = true;
      checkToken();
      const interval = setInterval(checkToken, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isClient, checkToken]);

  return isClient ? <>{children}</> : null;
}

export default function ClientProviders({ children }) {
  return (
    <AppRouterCacheProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalToastContainer />
          <ConfirmProvider>
            <AuthAndProviders>{children}</AuthAndProviders>
          </ConfirmProvider>
        </ThemeProvider>
      </Provider>
    </AppRouterCacheProvider>
  );
}
