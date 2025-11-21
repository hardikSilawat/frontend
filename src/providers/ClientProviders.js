"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { toast } from "react-toastify";
import { setUser } from "@/redux/reducers";
import { setAdmin } from "@/redux/reducers";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/apiHandler/page";
import { ThemeProvider } from "@mui/material/styles";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "@/app/theme";
import GlobalToastContainer from "@/components/GlobalToast/page";
import { ConfirmProvider } from "@/contexts/ConfirmContext";
import AuthRedirect from "@/components/AuthRedirect";

export default function ClientProviders({ children }) {
  return (
    // <AppRouterCacheProvider>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalToastContainer />
        <ConfirmProvider>
          <AuthRedirect>
            <InnerClientProviders>{children}</InnerClientProviders>
          </AuthRedirect>
        </ConfirmProvider>
      </ThemeProvider>
    </Provider>
    // </AppRouterCacheProvider>
  );
}

function InnerClientProviders({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useRef(false);

  const handleInvalidToken = useCallback(
    (isAdminRoute, tokenName) => {
      const currentPathname = window.location.pathname;
      Cookies.remove(tokenName, { path: "/" });
      if (isAdminRoute) {
        dispatch(setAdmin(null));
        if (!currentPathname.startsWith("/admin/login")) {
          router.push("/admin/login");
        }
      } else {
        dispatch(setUser(null));
        if (!currentPathname.startsWith("/login")) {
          router.push("/login");
        }
      }
      toast.error("Your session has expired. Please log in again.");
    },
    [dispatch, router]
  );
  const checkToken = useCallback(async () => {
    const isAdminRoute = pathname?.startsWith("/admin");
    const tokenName = isAdminRoute ? "AdminToken" : "UserToken";
    let token = Cookies.get(tokenName);

    // Check for token in URL parameters (for email links, etc.)
    const searchParams = new URLSearchParams(window.location.search);
    const searchToken = searchParams.get("token");

    if (searchToken) {
      token = searchToken;
      // Remove token from URL without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("token");
      window.history.replaceState({}, document.title, newUrl.toString());
    }

    if (!token) {
      if (isAdminRoute) {
        dispatch(setAdmin(null));
      } else {
        dispatch(setUser(null));
      }
      return;
    }

    try {
      const response = await api.get(`/auth/me`);

      if (response?.success) {
        // Update token in cookies with fresh expiration
        Cookies.set(tokenName, token, {
          expires: 100 * 365,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        // Updated success condition
        if (isAdminRoute) {
          dispatch(setAdmin(response.data));
          if (pathname === "/admin/login") {
            router.push("/admin/dashboard");
          }
        } else {
          dispatch(setUser(response.data));
          if (pathname === "/login") {
            router.push("/dashboard");
          }
        }
      } else {
        handleInvalidToken(isAdminRoute, tokenName);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      handleInvalidToken(isAdminRoute, tokenName);
    }
  }, [dispatch, router, pathname, handleInvalidToken]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      checkToken();

      // Check token every 5 minutes
      const interval = setInterval(checkToken, 5 * 60 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [checkToken]);

  return <>{children}</>;
}
