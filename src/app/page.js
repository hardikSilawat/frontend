"use client";

import dynamic from "next/dynamic";

// Dynamically import the UserLoginPage component
const UserLoginPage = dynamic(() => import("@/app/(auth)/login/page"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <p>Loading login page...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      CI / CD <UserLoginPage />
    </>
  );
}
